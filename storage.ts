import { Item } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Turns items array into string to be saved into AsyncStorage
export async function saveItems(items: Item[]): Promise<void> {
    await AsyncStorage.setItem('items', JSON.stringify(items));
}

// Returns an empty array if nothing is stored yet, so the app always starts with a valid list
export async function loadItems(): Promise<Item[]> {
    const stored = await AsyncStorage.getItem('items');
    if (!stored) return [];
    return JSON.parse(stored);
}