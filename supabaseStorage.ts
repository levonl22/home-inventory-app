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
  await supabase.from('items').delete().eq('household_id', householdId);
  if (items.length === 0) return;
  await supabase.from('items').insert(
    items.map(item => ({
      household_id: householdId,
      name: item.name,
      count: item.count,
      expiration_date: item.expiration_date ?? null,
    }))
  );
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