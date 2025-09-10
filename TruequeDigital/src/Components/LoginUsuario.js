import React, {useState} from "react";
import { View, TextInput, Text, Button } from "react-native"
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginUsuarios({ navigation }) {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {

        try {
            const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
            console.log("Bienvenido:", user.uid);

            navigation?.replace("Home", { uid: user.uid });

        } catch (error) {
            console.log(error.mesage);
        }
  };
         

    return(
         <View>

            <Text>Email:</Text>
                <TextInput onChangeText={setEmail} 
                            value={email}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={{ borderWidth: 1, marginBottom: 10 }} />
            
            <Text>Contraseña:</Text>
                <TextInput secureTextEntry
                            value={password}
                            onChangeText={setPassword} 
                            style={{ borderWidth: 1, marginBottom: 10 }} />


            <Button title="Iniciar sesión" onPress={handleSignIn} />

         </View>
    )
}