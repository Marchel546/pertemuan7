import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, Alert, Keyboard 
} from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState('Sedang'); // Tinggi, Sedang, Rendah
  const [filter, setFilter] = useState('Semua'); // Semua, Aktif, Selesai

  // 1. Fitur Tambah Task (Add & Validasi)
  const handleAddTask = () => {
    if (inputText.trim() === '') {
      Alert.alert('Oops!', 'Nama task tidak boleh kosong, ya!');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      text: inputText,
      priority: priority,
      isDone: false,
    };
    
    setTasks([...tasks, newTask]);
    setInputText('');
    Keyboard.dismiss();
  };

  // 2. Fitur Hapus Task (Delete)
  const handleDeleteTask = (id) => {
    Alert.alert('Hapus Task', 'Yakin ingin menghapus task ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', onPress: () => setTasks(tasks.filter(item => item.id !== id)), style: 'destructive' }
    ]);
  };

  // 3. Fitur Mark as Done (Toggle)
  const handleToggleDone = (id) => {
    setTasks(tasks.map(item => 
      item.id === id ? { ...item, isDone: !item.isDone } : item
    ));
  };

  // Logika Filter & Counter
  const completedCount = tasks.filter(t => t.isDone).length;
  const filteredTasks = tasks.filter(t => {
    if (filter === 'Aktif') return !t.isDone;
    if (filter === 'Selesai') return t.isDone;
    return true; // 'Semua'
  });

  // Helper untuk warna prioritas
  const getPriorityColor = (pri) => {
    if (pri === 'Tinggi') return '#ff6b6b';
    if (pri === 'Sedang') return '#feca57';
    return '#1dd1a1';
  };

  // Render per item di FlatList
  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity 
        style={[styles.checkbox, item.isDone && styles.checkboxDone]} 
        onPress={() => handleToggleDone(item.id)}
      >
        {item.isDone && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>
      
      <View style={styles.taskTextContainer}>
        <Text style={[styles.taskText, item.isDone && styles.taskTextDone]}>
          {item.text}
        </Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteTask(item.id)}>
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header & Counter */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyTaskList</Text>
        <Text style={styles.counterText}>
          {completedCount} dari {tasks.length} task selesai
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['Semua', 'Aktif', 'Selesai'].map(f => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List Tasks */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada task di sini. Santai dulu! ☕</Text>
          </View>
        }
      />

      {/* Form Input (KeyboardAvoidingView) */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputSection}
      >
        {/* Pilihan Prioritas */}
        <View style={styles.prioritySelector}>
          {['Rendah', 'Sedang', 'Tinggi'].map(p => (
            <TouchableOpacity 
              key={p} 
              style={[styles.priorityOption, priority === p && { backgroundColor: getPriorityColor(p) }]}
              onPress={() => setPriority(p)}
            >
              <Text style={[styles.priorityOptionText, priority === p && { color: '#222', fontWeight: 'bold' }]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Text & Tombol Add */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Mau ngerjain apa hari ini?"
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 50 },
  header: { paddingHorizontal: 20, marginBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  counterText: { fontSize: 14, color: '#aaa', marginTop: 5 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#333' },
  filterBtnActive: { backgroundColor: '#4facfe' },
  filterText: { color: '#aaa', fontSize: 14 },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#666', fontSize: 16, fontStyle: 'italic' },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 15, borderRadius: 12, marginBottom: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#4facfe', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  checkboxDone: { backgroundColor: '#4facfe' },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  taskTextContainer: { flex: 1 },
  taskText: { fontSize: 16, color: '#fff', marginBottom: 4 },
  taskTextDone: { color: '#666', textDecorationLine: 'line-through' },
  priorityBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  priorityText: { fontSize: 10, color: '#222', fontWeight: 'bold' },
  deleteBtn: { padding: 8 },
  deleteBtnText: { color: '#ff6b6b', fontSize: 18, fontWeight: 'bold' },
  inputSection: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', padding: 15, borderTopWidth: 1, borderTopColor: '#333' },
  prioritySelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 5 },
  priorityOption: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: '#444' },
  priorityOptionText: { color: '#aaa', fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, height: 50, backgroundColor: '#2a2a2a', borderRadius: 25, paddingHorizontal: 20, color: '#fff', fontSize: 16 },
  addBtn: { width: 50, height: 50, backgroundColor: '#4facfe', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});