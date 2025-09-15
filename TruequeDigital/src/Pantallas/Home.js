// src/Pantallas/Home.js
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Image, TextInput, Button, TouchableOpacity } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../firebaseConfig";

export default function Home({ navigation }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const q = query(collection(db, "publicaciones"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPublicaciones(items);
    });
    return unsub;
  }, []);

  const filtradas = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return publicaciones;
    return publicaciones.filter((p) =>
      (p.titulo || "").toLowerCase().includes(t) || (p.descripcion || "").toLowerCase().includes(t)
    );
  }, [busqueda, publicaciones]);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Buscar por palabra clave..."
            value={busqueda}
            onChangeText={setBusqueda}
            style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
          />
        </View>
        <Button title="Nuevo" onPress={() => navigation.navigate("CrearPublicacion")} />
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 24 }}>No hay publicaciones aún.</Text>}
        renderItem={({ item }) => (
          
          <TouchableOpacity style={{ borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 10 }}>
            {item.imagenUrl ? (
              <Image source={{ uri: item.imagenUrl }} style={{ width: "100%", height: 180, borderRadius: 8 }} />
            ) : null}
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}>{item.titulo}</Text>
            <Text style={{ marginTop: 4 }}>{item.descripcion}</Text>
          </TouchableOpacity>
          
        )}
      />

      <View style={{ marginTop: 8 }}>
        <Button title="Cerrar sesión" onPress={() => signOut(auth)} />
      </View>
    </View>
  );
}
