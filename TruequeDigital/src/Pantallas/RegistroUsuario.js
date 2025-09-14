// src/Pantallas/RegistroUsuario.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function RegistroUsuario({ navigation }) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const onRegister = async () => {
    try {
      if (!email || !password || !nombre) return Alert.alert("Error", "Completa todos los campos");
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: nombre.trim() });
      Alert.alert("¡Listo!", "Cuenta creada. Ya puedes iniciar sesión.");
      navigation.navigate("Login");
    } catch (e) {
      Alert.alert("No se pudo registrar", e.message);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Crear cuenta</Text>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />
      <Button title="Registrarme" onPress={onRegister} />
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ textAlign: "center", marginTop: 12 }}>
          ¿Ya tienes cuenta? <Text style={{ fontWeight: "bold" }}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
