import { Item } from './types';

function getTotalCount(items: Item[]): number {
  let total = 0;

  for (const item of items) {
    total += item.count;
  }
  
  return total;
}

function createItem(name: string, count: number): Item[] {
  return {
    id: Date.now().toString(),
    name,
    count,
  }
}

function updateItemCount(
  items: Item[],
  id: string,
  newCount: number
): Item[] {
  return items.map(item =>
    item.id === id ? { ...item, count: newCount } : item
  );
}

// Optional helpers
function addItem(items: Item[], newItem: Item): Item[] {
  if (items.some(item => item.id === newItem.id)) return items;
  return [...items, newItem];
}

function removeItem(items: Item[], id: string): Item[] {
  return items.filter(item => item.id !== id);
}

// "Main" section — test your functions
const items: Item[] = [
  { id: '1', name: 'Apple', count: 3 },
  { id: '2', name: 'Banana', count: 5 },
];

console.log('Total:', getTotalCount(items));

const newItems = updateItemCount(items, '1', 10);
console.log('After update:', newItems);

const addedItems = addItem(newItems, { id: '3', name: 'Orange', count: 2 });
console.log('After add:', addedItems);

const removedItems = removeItem(addedItems, '2');
console.log('After remove:', removedItems);