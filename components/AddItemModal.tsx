import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRef, useEffect } from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  text: string;
  setText: (v: string) => void;
  count: string;
  setCount: (v: string) => void;
  placeholder: string;
}

export default function AddItemModal({ visible, onClose, onAdd, text, setText, count, setCount, placeholder }: Props) {
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) setTimeout(() => nameInputRef.current?.focus(), 100);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, margin: 20 }}>
          <TextInput
            ref={nameInputRef}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
          />
          <TextInput
            value={count}
            onChangeText={setCount}
            placeholder="Insert item quantity"
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
          />
          <TouchableOpacity
            onPress={onAdd}
            style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 10 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}