// src/Pantallas/RegistroUsuario.js
import React, { useState } from "react";
import { View, TextInput, Text, Button, StyleSheet, Alert } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";


export default function RegistroUsuario() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [pais, setPais] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      // Validación estricta (todos requeridos)
      if (!nombre.trim() || !apellido.trim() || !pais.trim() || !departamento.trim() || !ciudad.trim() || !email.trim() || !password) {
        return Alert.alert("Campos requeridos", "Debes completar todos los campos.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: user.email,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        pais: pais.trim(),
        departamento: departamento.trim(),
        ciudad: ciudad.trim(),
        fechaCreacion: serverTimestamp(),
      });

      Alert.alert("Registro exitoso", `Bienvenido/a, ${nombre}`);
    } catch (error) {
      console.log(error);
      Alert.alert("No se pudo registrar", error?.message || "Error desconocido");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.title}>Componente Creación de Usuario</Text>

      <Text>Nombre:</Text>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <Text>Apellido:</Text>
      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        style={styles.input}
      />

      <Text>País:</Text>
      <TextInput
        placeholder="País"
        value={pais}
        onChangeText={setPais}
        style={styles.input}
      />

      <Text>Departamento:</Text>
      <TextInput
        placeholder="Departamento"
        value={departamento}
        onChangeText={setDepartamento}
        style={styles.input}
      />

      <Text>Ciudad:</Text>
      <TextInput
        placeholder="Ciudad"
        value={ciudad}
        onChangeText={setCiudad}
        style={styles.input}
      />

      <Text>Correo electrónico:</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text>Contraseña:</Text>
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
