// src/Pantallas/MisSolicitudes.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, FlatList, Alert } from "react-native";
import { auth, db } from "../../firebaseConfig";
import {collection, onSnapshot, orderBy, query, updateDoc, doc, where, serverTimestamp,} from "firebase/firestore";

export default function MisSolicitudes({ navigation }) {
  const uid = auth.currentUser?.uid;
  const [tab, setTab] = useState("recibidas"); 
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    if (!uid) return;
    const q =
    //si tab es "recibidas" usa el primer query; si no, usa el segundo.
      tab === "recibidas"
        //Referencia a la colección solicitudes en Firestore.
        //where("destinatarioId", "==", uid):  Filtro: trae documentos donde el campo destinatarioId es igual al ID del usuario actual
        //Ordena por fecha de creación descendente (las más nuevas primero).
        ? query(collection(db, "solicitudes"), where("destinatarioId", "==", uid), orderBy("createdAt", "desc"))
        //trae documentos donde el campo ofertanteId es el tuyo
        : query(collection(db, "solicitudes"), where("ofertanteId", "==", uid), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setSolicitudes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
    //hook de React que ejecuta una función cada vez que cambian las dependencias del arreglo [uid, tab]
  }, [uid, tab]);

  const actualizarEstado = async (s, estado) => {
    try {
      await updateDoc(doc(db, "solicitudes", s.id), { estado, updatedAt: serverTimestamp() });
      Alert.alert("Listo", `Solicitud ${estado}.`);
      if (estado == "aceptada"){
        navigation.navigate('Chat')
      }
    } catch (e) {
      Alert.alert("Error", e?.message || "No se pudo actualizar la solicitud.");
    }
  };

  const Item = ({ s }) => {
    const recibida = tab === "recibidas";
    return (
      <View style={{ borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold" }}>{s.publicacionTitulo || s.publicacionId}</Text>
        <Text style={{ marginTop: 6 }}>Oferta: {s.propuesta || "(sin oferta)"}</Text>
        <Text style={{ marginTop: 6, opacity: 0.8 }}>Estado: {s.estado}</Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          {recibida && s.estado === "pendiente" ? (
            <>
              <Button title="Aceptar" onPress={() => actualizarEstado(s, "aceptada")} />
              <Button title="Rechazar" onPress={() => actualizarEstado(s, "rechazada")} />
            </>
          ) : null}
          {!recibida && s.estado === "pendiente" ? (
            <Button title="Cancelar" onPress={() => actualizarEstado(s, "cancelada")} />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>

        <TouchableOpacity onPress={() => setTab("recibidas")}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderRadius: 8, backgroundColor: tab === "recibidas" ? "#eee" : "transparent", }}>
          <Text style={{ textAlign: "center" }}>Recibidas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("enviadas")}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderRadius: 8, backgroundColor: tab === "enviadas" ? "#eee" : "transparent", }} >
          <Text style={{ textAlign: "center" }}>Enviadas</Text>
        </TouchableOpacity>

      </View>

      <FlatList data={solicitudes} keyExtractor={(item) => item.id}
        ListEmptyComponent = {<Text style={{ textAlign: "center", marginTop: 24 }}>No hay solicitudes.</Text>}
        renderItem={({ item }) => <Item s={item} />} />

    </View>
  );
}
