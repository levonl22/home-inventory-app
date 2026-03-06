import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { useItems } from './useItems';

export default function App() {
  const { items, loading, addItem, removeItem, updateItemName, updateItemCount } = useItems();
  const [text, setText] = useState('');
  const [count, setCount] = useState('');
  const [inputPlaceholder, setPlaceholder] = useState('Insert item name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading) return <Text>Loading...</Text>;

  // ---- Helpers ----
  const closeAddModal = () => {
    setPlaceholder('Insert item name');
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedId(null);
  };

  const handleAdd = () => {
    if (text.trim() === '') return;

    const newCount = parseInt(count);
    const validCount = isNaN(newCount) ? 0 : newCount;
    if (validCount < 0) return;

    const success = addItem(text, validCount);
    if (!success) {
      setPlaceholder('Item already added');
      setText('');
      return;
    }

    setText('');
    setCount('');
    setShowAddModal(false);
  };

  const handleEdit = () => {
    if (selectedId === null) return;

    const newCount = parseInt(count);
    const validCount = isNaN(newCount) ? 0 : newCount;

    if (text.trim() === '') return;
    if (validCount < 0) return;
    if (items.some(item => item.id !== selectedId && item.name.toLowerCase() === text.toLowerCase())) return;

    updateItemName(selectedId, text);
    updateItemCount(selectedId, validCount)
    closeEditModal();
  };

  // ---- Render ----
  return (
    <View style={{ flex: 1, padding: 16, alignItems: 'center', marginTop: 56, marginBottom: 200 }}>
      <Text style={{ textAlign: 'center', paddingBottom: 40, fontSize: 45, fontWeight: 'bold' }}>
        We Have Food At Home
      </Text>

      <StatusBar style="auto" />

      {/* ---- List ---- */}
      <View style={{ flex: 1, width: '100%' }}>
        {items.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <TouchableOpacity
              style={{ flex : 1 }}
              onPress={() => {
                setSelectedId(item.id);
                setShowEditModal(true);
                setText(item.name);
                setCount(item.count.toString());
              }}
            >
              <Text style={{ fontSize: 30 }}>
                ({item.count}) {item.name}
              </Text>
            </TouchableOpacity>
        {/* ---- Remove Button ---- */}
            <TouchableOpacity
              style={{ marginLeft: 'auto', flexDirection: 'row' }}
              onPress={() => removeItem(item.id)}
            >
              <Text> X </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ---- Add Button ---- */}
        <TouchableOpacity
          style={{
            backgroundColor: '#0080ffff',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            width: 50,
            alignSelf: 'center',
            marginTop: 10,
          }}
          onPress={() => {
            setShowAddModal(true);
            setText('');
            setCount('');
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* ---- Add Modal ---- */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, margin: 20 }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={inputPlaceholder}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
            />
            <TextInput
              value={count}
              onChangeText={setCount}
              placeholder="Insert item quantity"
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
            />

            <TouchableOpacity
              onPress={handleAdd}
              style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 10 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Item</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeAddModal}>
              <Text style={{ textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ---- Edit Modal ---- */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, margin: 20 }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Edit name"
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
            />
            <TextInput
              value={count}
              onChangeText={setCount}
              placeholder="Edit count"
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
            />

            <TouchableOpacity
              onPress={handleEdit}
              style={{ backgroundColor: '#2e872eff', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 10 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeEditModal}>
              <Text style={{ textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
