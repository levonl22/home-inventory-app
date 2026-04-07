import { supabase } from './supabase';
import { Item } from './types';

export async function getOrCreateHousehold(userId: string): Promise<number> {
  // Check if profile already exists with a household_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('household_id')
    .eq('id', userId)
    .single();

  if (profile?.household_id) return profile.household_id;

  // Create a new household
  const { data: household, error: householdError } = await supabase
    .from('households')
    .insert({ name: 'My Household' })
    .select('id')
    .single();

  if (householdError || !household) throw new Error(`Failed to create household: ${householdError?.message} | code: ${householdError?.code}`);

  // Create profile row linking user to household
  const { error: profileError } = await supabase
      .from('profiles')
      .update({ household_id: household.id })
      .eq('id', userId);

  if (profileError) throw new Error(`Failed to update profile: ${profileError?.message} | code: ${profileError?.code}`);

    return household.id;
  }

export async function syncItemsToSupabase(items: Item[], householdId: number): Promise<void> {
  if (items.length === 0) {
    await supabase.from('items').delete().eq('household_id', householdId);
    return;
  }

  // Upsert based on household_id + name. Updates existing items, inserts new ones.
  await supabase.from('items').upsert(
    items.map(item => ({
      household_id: householdId,
      name: item.name,
      count: item.count,
      expiration_date: item.expiration_date ?? null,
    })),
    { onConflict: 'household_id,name' }
  );

  // Remove items from cloud that no longer exist locally
  const { data: cloudItems } = await supabase
    .from('items')
    .select('name')
    .eq('household_id', householdId);

  if (cloudItems) {
    const localNames = new Set(items.map(i => i.name.toLowerCase()));
    const toDelete = cloudItems.filter(i => !localNames.has(i.name.toLowerCase()));
    if (toDelete.length > 0) {
      await supabase.from('items').delete().eq('household_id', householdId).in('name', toDelete.map(i => i.name));
    }
  }
}

export async function loadItemsFromSupabase(householdId: number): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('household_id', householdId);
  if (error || !data) return [];
  return data.map(row => ({
    id: row.id.toString(),
    name: row.name,
    count: row.count,
    expiration_date: row.expiration_date ?? undefined,
  }));
}