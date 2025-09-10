import React from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function Home( { navigation } ) {
  const route = useRoute();
  const { uid } = route.params || {};

  return (

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

        <Text>Bienvenido a Home 👋</Text>
        <Button title="Ofrecer trueque" onPress = {() => navigation.navigate('Trueque')} />  

    </View>

  );
}
