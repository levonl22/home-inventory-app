import { useState, useEffect, useRef } from 'react';
import { Item } from './types';
import { saveItems, loadItems } from './storage';
import { syncItemsToSupabase, loadItemsFromSupabase, getOrCreateHousehold } from './supabaseStorage';
import { supabase } from './supabase';

export function useItems(user: any) {

    // ---- State ----
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [householdId, setHouseholdId] = useState<number | null>(null);
    const [pendingMergeItems, setPendingMergeItems] = useState<Item[]>([]);

    // Ref used to suppress the sync useEffect that fires after loading from Supabase or AsyncStorage.
    // Without this, every load would trigger an unnecessary write back to Supabase.
    const isInitialLoad = useRef(true);

    // ---- Initial Load ----
    // Runs once on mount. Loads items from AsyncStorage so the list is available immediately,
    // even before the user logs in or Supabase responds.
    useEffect(() => {
        async function load() {
            const stored = await loadItems();
            setItems(stored);
            setLoading(false);
        }
        load();
    }, []);

    // ---- Auth Sync ----
    // Runs when the user logs in or out, and after the initial AsyncStorage load completes.
    // Handles switching between local-only mode and cloud-synced mode.
    useEffect(() => {
        if (loading) return; // wait for AsyncStorage load before doing anything

        if (!user) {
            // Logged out — drop the household reference and reload from local storage
            setHouseholdId(null);
            isInitialLoad.current = true;
            loadItems().then(setItems);
            return;
        }

        // Logged in — connect to Supabase and sync
        async function initSupabase() {
            try {
                // Get or create the household tied to this user
                const hId = await getOrCreateHousehold(user.id);
                setHouseholdId(hId);

                const cloudItems = await loadItemsFromSupabase(hId);

                // Compare local and cloud items by name (case-insensitive).
                // Items only found locally weren't synced yet — surface them for the merge prompt.
                const localItems = await loadItems();
                const cloudNames = new Set(cloudItems.map(i => i.name.toLowerCase()));
                const localOnly = localItems.filter(i => !cloudNames.has(i.name.toLowerCase()));

                if (localOnly.length > 0) {
                    // Hold local-only items in state so App.tsx can prompt the user
                    setPendingMergeItems(localOnly);
                }

                // Set cloud items as source of truth regardless of merge outcome
                isInitialLoad.current = true;
                setItems(cloudItems);
                await saveItems(cloudItems);

            } catch (e) {
                console.error('Supabase init failed:', e);
            }
        }

        initSupabase();
    }, [user, loading]);

    // ---- Real Time Sync ----
    // Subscribes to live changes on the household's items from Supabase.
    // Any insert, update, or delete from another household member updates the local list.
    useEffect(() => {
        if (!householdId) return;

        const channel = supabase
            .channel(`items:${householdId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'items',
                    filter: `household_id=eq.${householdId}`,
                },
                async () => {
                    // Re-fetch the full list on any change rather than patching state manually
                    const cloudItems = await loadItemsFromSupabase(householdId);
                    isInitialLoad.current = true;
                    setItems(cloudItems);
                    await saveItems(cloudItems);
                }
            )
            .subscribe();

        // Unsubscribe when household changes or user signs out
        return () => {
            supabase.removeChannel(channel);
        };
    }, [householdId]);

    // ---- Persist and Sync ----
    // Runs whenever items change. Saves to AsyncStorage always.
    // If logged in, also syncs to Supabase.
    // Skipped on the first render after a load to avoid writing back what was just read.
    useEffect(() => {
        if (loading) return;
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        saveItems(items);

        if (user && householdId !== null) {
            syncItemsToSupabase(items, householdId).catch(e =>
                console.error('Supabase sync failed:', e)
            );
        }
    }, [items]);

    // ---- Helpers ----

    // Creates a new Item object with a unique id based on the current timestamp
    function createItem(name: string, count: number): Item {
        return {
            id: Date.now().toString(),
            name,
            count,
        };
    }

    // ---- Item Operations ----

    // Returns false if an item with the same name already exists (case-insensitive)
    function addItem(name: string, count: number): boolean {
        if (items.some(item => item.name.toLowerCase() === name.toLowerCase())) return false;
        const newItem = createItem(name, count);
        setItems(currentItems => [...currentItems, newItem]);
        return true;
    }

    function removeItem(id: string) {
        setItems(currentItems => currentItems.filter(item => item.id !== id));
    }

    function updateItemName(id: string, newName: string) {
        setItems(currentItems => currentItems.map(item =>
            item.id === id ? { ...item, name: newName } : item
        ));
    }

    function updateItemCount(id: string, newCount: number) {
        setItems(currentItems => currentItems.map(item =>
            item.id === id ? { ...item, count: newCount } : item
        ));
    }

    // ---- Merge Resolution ----
    // Called by App.tsx when the user responds to the merge prompt.
    // keep=true pushes local-only items into the household list and syncs to Supabase.
    // keep=false discards them and clears the pending state.
    async function resolveMerge(keep: boolean) {
        if (!keep || householdId === null) {
            setPendingMergeItems([]);
            return;
        }
        const merged = [...items, ...pendingMergeItems];
        isInitialLoad.current = true;
        setItems(merged);
        await saveItems(merged);
        await syncItemsToSupabase(merged, householdId);
        setPendingMergeItems([]);
    }

    return { items, loading, addItem, removeItem, updateItemName, updateItemCount, pendingMergeItems, resolveMerge };
}