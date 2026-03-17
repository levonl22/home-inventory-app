import { supabase } from './supabase';
import { Item } from './types';

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