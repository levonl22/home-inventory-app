import { useState, useEffect } from 'react';
import { Item } from './types';
import { saveItems, loadItems } from './storage';

export function useItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const stored = await loadItems();
            setItems(stored);
            setLoading(false);
        }
        load();
    }, []);

    useEffect(() => {
        if (!loading) saveItems(items);
    }, [items]);

    function createItem(name: string, count: number): Item {
        return {
            id: Date.now().toString(),
            name,
            count,
        }
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

    return { items, loading, addItem, removeItem, updateItemName, updateItemCount }
}