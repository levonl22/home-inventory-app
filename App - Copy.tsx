import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Touchable } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Modal } from 'react-native';

type Item = {
  name: string;
  count: number;
};

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { name: 'Milk', count: 1 }
  ]);
  const saveItems = async (items: Item[]) => {
  await AsyncStorage.setItem('items', JSON.stringify(items));
  };
  const [text, setText] = useState('');
  const newItem: Item = { name: text, count: 0}
  const [inputPlaceholder, setPlaceholder] = useState('Add item here');
  const [showAddModal, setShowAddModal] = useState(false);

  const closeModal = () => {
    setPlaceholder('Add item here');
    setShowAddModal(false);
  };

  const addItem = () => {
    if (text.trim() === '') return;
    if (items.some(item => item.name.toLowerCase() === text.toLowerCase())) {
      setPlaceholder('Item already added');
      setText('');
      return;
    }
    setItems([...items, newItem]);
    setText('');
    setShowAddModal(false);
  };
  
  
  useEffect(() => {
  const loadItems = async () => {
    const stored = await AsyncStorage.getItem('items');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  };
  loadItems();
  }, []);
  
  useEffect(() => {
  saveItems(items);
  }, [items]);

  return (
    <View style={{ 
      flex: 1,
      padding: 16,
      alignItems: 'center',
      marginTop: 56,
      marginBottom: 200
      }}
    >
      <Text style = {{ 
        paddingBottom: 50,
        fontSize: 30,
        fontWeight: 'bold'
        }}
      >Fridge Inventory
      </Text>

      <StatusBar style="auto" />

      <View style = {{
        flex: 1
      }}>
        {items.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>

            <Text>{item.name} ({item.count})</Text>
            <TouchableOpacity
              onPress={() => {
                setItems(items.map((item, i) =>
                i === index ? { ...item, count: Math.max(0, item.count - 1) } : item
              ));
              }}
              style={{
                borderWidth: 1,
                borderColor: '#000000ff',
                borderRadius: 6,
                paddingHorizontal: 15,
                paddingVertical: 6,
                marginLeft: 8,
              }}
            >
              <Text style={{ fontSize: 18, color: '#007AFF', fontWeight: 'bold' }}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setItems(items.map((item, i) =>
                i === index ? { ...item, count: item.count + 1 } : item
              ));
              }}
              style={{
                borderWidth: 1,
                borderColor: '#000000ff',
                borderRadius: 6,
                paddingHorizontal: 15,
                paddingVertical: 6,
                marginLeft: 8,
              }}
            >
              <Text style={{ fontSize: 18, color: '#007AFF', fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginLeft: 'auto', flexDirection: 'row'}}
              onPress={() => {
                setItems(items.filter((_, i) => i !== index));
              }}
            >
              <Text> X </Text>
            </TouchableOpacity>
          </View>
        ))}

      <TouchableOpacity
        style={{
          backgroundColor: '#ffa200ff',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            margin: 20
          }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={inputPlaceholder}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 6,
                marginBottom: 10,
              }}
            />

            <TouchableOpacity
              onPress={() => {
                addItem();
              }}
              style={{
                backgroundColor: '#007AFF',
                padding: 10,
                borderRadius: 6,
                alignItems: 'center',
                marginBottom: 10
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => closeModal()}>
              <Text style={{ textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
