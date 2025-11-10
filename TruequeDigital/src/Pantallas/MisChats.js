import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function MisChats({ navigation }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', uid),
      orderBy('updatedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(items);
    }, (err) => {
      console.error('mischats onSnapshot', err);
    });
    return unsub;
  }, []);

  const renderItem = ({ item }) => {
    const uid = auth.currentUser?.uid;
    const otherIds = (item.participants || []).filter(p => p !== uid);
    const title = item.title || (item.participantNames ? otherIds.map(id => item.participantNames[id]).join(', ') : (otherIds[0] || 'Contacto'));
    const last = item.lastMessage || 'Nueva conversación';

    return (
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Chat', { chatId: item.id })}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.last}>{last}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(c) => c.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>No tienes conversaciones aún.</Text>}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  item: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 8 },
  title: { fontWeight: '600', marginBottom: 4 },
  last: { color: '#666' },
});
