import { Item } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

//turns items array into string to be saved into AsyncStorage
export async function saveItems(items: Item[]): Promise<void> {
    await AsyncStorage.setItem('items', JSON.stringify(items));
}

//gets stored string from AsyncStorage and parses it back into item array
export async function loadItems(): Promise<Item[]> {
    const stored = await AsyncStorage.getItem('items');
    if (!stored) return [];
    return JSON.parse(stored);
}