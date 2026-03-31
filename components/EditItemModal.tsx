import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  text: string;
  setText: (v: string) => void;
  count: string;
  setCount: (v: string) => void;
}

export default function EditItemModal({ visible, onClose, onSave, text, setText, count, setCount }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, margin: 20 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Edit name"
            placeholderTextColor="#999"
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
          />
          <TextInput
            value={count}
            onChangeText={setCount}
            placeholder="Edit count"
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
          />
          <TouchableOpacity
            onPress={onSave}
            style={{ backgroundColor: '#2e872eff', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 10 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}