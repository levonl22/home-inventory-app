import { Item } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveItems(items: Item[]): Promise<void> {
    AsyncStorage.setItem('items', JSON.stringify(items));
}
export async function loadItems(): Promise<Item[]> {
    const stored = await AsyncStorage.getItem('items');
    if (!stored) return [];
    return JSON.parse(stored);
}