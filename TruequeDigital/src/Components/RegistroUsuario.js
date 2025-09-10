import React, {useState} from "react";
import { View, TextInput, Text, Button, StyleSheet } from "react-native"
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

export default function RegistroUsuario() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [pais, setPais] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [ciudad, setCiudad] = useState("");

    const handleRegister = async () => {

        try{

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc ( doc ( db, "usuarios", user.uid ), {
                uid: user.uid,
                email: user.email,
                nombre: nombre,
                apellido: apellido,
                pais: pais,
                departamento: departamento,
                ciudad: ciudad,
                fechaCreacion: new Date()
            });

            console.log("Bienvenido a Trueque Digital, ", user);
            
        } catch (error) {
            console.log(error.message);
        }
    };

     
    return(
        <View style={{ padding: 20 }}>
            <Text>Componente Creación de Usuario</Text>

            <Text>Nombre:</Text>
            <TextInput placeholder="Nombre" 
                        value = {nombre}
                        onChangeText={setNombre} 
                        style={{borderWidth: 1, marginBottom: 10 }} />
            
            <Text>Apellidos:</Text>
            <TextInput placeholder="Apellidos" 
                        value = {apellido}
                        onChangeText={setApellido} 
                        style={{borderWidth: 1, marginBottom: 10 }} />
            
            <Text>Pais de residencia:</Text>
            <TextInput placeholder="País de residencia" 
                        value = {pais}
                        onChangeText={setPais} 
                        style={{borderWidth: 1, marginBottom: 10 }} />

            <Text>Departamento o Estado:</Text>
            <TextInput placeholder="Departamento o estado" 
                        value = {departamento}
                        onChangeText={setDepartamento} 
                        style={{borderWidth: 1, marginBottom: 10 }} />

            <Text>Ciudad:</Text>
            <TextInput placeholder="Ciudad" 
                        value = {ciudad}
                        onChangeText={setCiudad} 
                        style={{borderWidth: 1, marginBottom: 10 }} />

            <Text>Email:</Text>
            <TextInput placeholder="Correo electrónico"
                        value = {email}
                        onChangeText={setEmail} 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{ borderWidth: 1, marginBottom: 10 }} />

            <Text>Contraseña:</Text>
            <TextInput placeholder="Contraseña" 
                        value = {password}
                        secureTextEntry onChangeText={setPassword} 
                        style={{borderWidth: 1, marginBottom: 10 }} />

            
            
            <Button title="Registrarse" onPress={handleRegister} />
            
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});