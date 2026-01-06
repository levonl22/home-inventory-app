import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Modal } from 'react-native';

type Item = { //new object Item
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
  const [count, setCount] = useState('');
  const [inputPlaceholder, setPlaceholder] = useState('Insert item name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeAddModal = () => {
    setPlaceholder('Insert item name');
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const addItem = () => {
    if (text.trim() === '') return;

    const newCount = parseInt(count);
    const validCount = isNaN(newCount) ? 0 : newCount;
    if (validCount < 0) return;

    if (items.some(item => item.name.toLowerCase() === text.toLowerCase())) {
      setPlaceholder('Item already added');
      setText('');
      return;
    }

    setItems([...items, { name: text, count: validCount }]);
    setText('');
    setCount('');
    setShowAddModal(false);
  };

  const editItem = () => {
    if (selectedIndex === null) return;

    const newCount = parseInt(count);
    const validCount = isNaN(newCount) ? 0 : newCount;

    if (text.trim() === '') return;
    if (validCount < 0) return;
    if (items.some((item, i) => i !== selectedIndex && item.name.toLowerCase() === text.toLowerCase())) return;

    setItems(items.map((item, i) =>
      i === selectedIndex ? { ...item, name: text, count: validCount } : item
    ));
    setShowEditModal(false);
    setSelectedIndex(null);
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
      <Text style={{
        textAlign: 'center',
        paddingBottom: 40,
        fontSize: 45,
        fontWeight: 'bold'
      }}
      >We Have Food At Home
      </Text>

      <StatusBar style="auto" />

      <View style={{
        flex: 1
      }}>
        {items.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedIndex(index);
                setShowEditModal(true);
                setText(item.name);
                setCount(item.count.toString());
              }}>
              <Text
                style={{ fontSize: 30 }}>
                ({item.count}) {item.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginLeft: 'auto', flexDirection: 'row' }}
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
            backgroundColor: '#0080ffff',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            width: 50,
            alignSelf: 'center'
          }}
          onPress={() => {
            setShowAddModal(true)
            setText('');
            setCount('');
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
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
              <TextInput
                value={count}
                onChangeText={setCount}
                placeholder='Insert item quantity'
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
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Item</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => closeAddModal()}>
                <Text style={{ textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showEditModal}
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
                placeholder='Edit name'
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              />
              <TextInput
                value={count}
                onChangeText={setCount}
                placeholder='Edit count'
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              />
              <TouchableOpacity
                onPress={() => { editItem() }}
                style={{
                  backgroundColor: '#2e872eff',
                  padding: 10,
                  borderRadius: 6,
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => closeEditModal()}>
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
