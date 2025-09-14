// src/Pantallas/CrearPublicacion.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../../firebaseConfig";

export default function CrearPublicacion({ navigation }) {
  const [imagen, setImagen] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permisos", "Se requiere acceso a la galería para subir imágenes.");
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.85,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const subirImagenYObtenerURL = async (uri) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No hay usuario autenticado.");

    // Lee archivo local como base64 (evita problemas con blob en Android)
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileRef = storageRef(storage, `publicaciones/${uid}/${Date.now()}.jpg`);
    const metadata = { contentType: "image/jpeg" };

    // Subir como base64
    await uploadString(fileRef, base64, "base64", metadata);
    const url = await getDownloadURL(fileRef);
    return url;
  };

  const onGuardar = async () => {
    try {
      if (!titulo.trim() || !descripcion.trim() || !imagen) {
        return Alert.alert("Campos requeridos", "Agrega imagen, título y descripción.");
      }
      setSaving(true);

      const imagenUrl = await subirImagenYObtenerURL(imagen);

      await addDoc(collection(db, "publicaciones"), {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        imagenUrl,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Éxito", "Publicación creada.");
      navigation.goBack();
    } catch (e) {
      console.log("Error al publicar:", e?.code, e?.message, e?.customData?.serverResponse);
      Alert.alert("Error", e?.message || "No se pudo crear la publicación.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Nueva publicación</Text>

      <Button title={imagen ? "Cambiar imagen" : "Cambiar imagen"} onPress={pickImage} />
      {imagen && (
        <Image source={{ uri: imagen }} style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 8 }} />
      )}

      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={4}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, textAlignVertical: "top" }}
      />

      <Button title={saving ? "Guardando..." : "Publicar"} onPress={onGuardar} disabled={saving} />
    </View>
  );
}
