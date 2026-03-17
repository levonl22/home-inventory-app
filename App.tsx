import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, TextInput as RNTextInput, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useItems } from './useItems';
import { Appearance } from 'react-native';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import LoginModal from './components/LoginModal';
import { supabase } from './supabase';


Appearance.setColorScheme('light');

export default function App() {
  const { items, loading, addItem, removeItem, updateItemName, updateItemCount } = useItems();
  const [text, setText] = useState('');
  const [count, setCount] = useState('');
  const [inputPlaceholder, setPlaceholder] = useState('Insert item name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

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
    <View style={{ flex: 1, padding: 24, marginTop: 80, marginBottom: 50, backgroundColor: '#fff' }}>
      <View style={{ width: '100%', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => user ? supabase.auth.signOut() : setShowLoginModal(true)}>
          <Text style={{ fontSize: 16, color: '#007AFF' }}>{user ? 'Sign Out' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ textAlign: 'center', paddingBottom: 40, fontSize: 45, fontWeight: 'bold' }}>
        We Have Food At Home
      </Text>

      <StatusBar style="auto" />

      <View style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
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
          </ScrollView>

        {/* ---- Add Button ---- */}
        <TouchableOpacity
          style={{
            backgroundColor: '#0080ffff',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            width: 50,
            alignSelf: 'center',
            marginTop: 'auto',
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
      <AddItemModal
        visible={showAddModal}
        onClose={closeAddModal}
        onAdd={handleAdd}
        text={text}
        setText={setText}
        count={count}
        setCount={setCount}
        placeholder={inputPlaceholder}
      />

      {/* ---- Edit Modal ---- */}
      <EditItemModal
        visible={showEditModal}
        onClose={closeEditModal}
        onSave={handleEdit}
        text={text}
        setText={setText}
        count={count}
        setCount={setCount}
      />
      {/* ---- Login Modal ---- */}
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
