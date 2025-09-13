import React from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getAuth, signOut } from 'firebase/auth';

export default function Home( { navigation } ) {
  const route = useRoute();
  const { uid } = route.params || {};

  const handleLogout = async() => {

    const auth = getAuth();

    try {
      await signOut(auth);
      console.log("Sesión cerrada")
      navigation.replace("Principal");
    } catch (error){
      console.error("Error al cerrar sesión", error);
    }

  }

  return (

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

        <Text>Bienvenido a Home 👋</Text>
        <Button title="Ofrecer trueque" onPress = {() => navigation.navigate('Trueque')} />  
        <Button title="Cerrar sesión" onPress = {handleLogout} />  

    </View>

  );
}
