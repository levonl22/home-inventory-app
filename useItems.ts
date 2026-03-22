import { useState, useEffect, useRef } from 'react';
import { Item } from './types';
import { saveItems, loadItems } from './storage';
import { syncItemsToSupabase, loadItemsFromSupabase, getOrCreateHousehold } from './supabaseStorage';

export function useItems(user: any) {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [householdId, setHouseholdId] = useState<number | null>(null);
    const isInitialLoad = useRef(true);

    // Initial load from AsyncStorage (always runs once on mount)
    useEffect(() => {
        async function load() {
            const stored = await loadItems();
            setItems(stored);
            setLoading(false);
        }
        load();
    }, []);

    // When user logs in or out, handle Supabase sync
    useEffect(() => {
        if (loading) return; // wait for initial AsyncStorage load to finish

        if (!user) {
            // Logged out — clear household, reload from local
            setHouseholdId(null);
            isInitialLoad.current = true;
            loadItems().then(setItems);
            return;
        }

        // Logged in — get/create household, then load from Supabase
        async function initSupabase() {
            try {
                const hId = await getOrCreateHousehold(user.id);
                setHouseholdId(hId);
                const cloudItems = await loadItemsFromSupabase(hId);
                isInitialLoad.current = true; // suppress sync trigger on this set
                setItems(cloudItems);
                await saveItems(cloudItems); // keep local in sync
            } catch (e) {
                console.error('Supabase init failed:', e);
            }
        }

        initSupabase();
    }, [user, loading]);

    // Persist and sync on item changes
    useEffect(() => {
        if (loading) return;
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return; // skip the sync that fires right after loading from Supabase
        }

        saveItems(items);

        if (user && householdId !== null) {
            syncItemsToSupabase(items, householdId).catch(e =>
                console.error('Supabase sync failed:', e)
            );
        }
    }, [items]);

    function createItem(name: string, count: number): Item {
        return {
            id: Date.now().toString(),
            name,
            count,
        };
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

    function addItem(name: string, count: number): boolean {
        if (items.some(item => item.name.toLowerCase() === name.toLowerCase())) return false;
        const newItem = createItem(name, count);
        setItems(currentItems => [...currentItems, newItem]);
        return true;
    }

    function removeItem(id: string) {
        setItems(currentItems => currentItems.filter(item => item.id !== id));
    }

    return { items, loading, addItem, removeItem, updateItemName, updateItemCount };
}