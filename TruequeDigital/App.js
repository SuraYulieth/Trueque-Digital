// App.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { inMemoryPersistence, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import NetInfo from "@react-native-community/netinfo"
import { Provider as PaperProvider } from "react-native-paper"
import Home from "./src/Pantallas/Home";
import LoginUsuario from "./src/Pantallas/LoginUsuario";
import RegistroUsuario from "./src/Pantallas/RegistroUsuario";
import CrearPublicacion from "./src/Pantallas/crearPublicacion";
import { Button } from "react-native-paper";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setChecking(false);
    });
    return unsub;
  }, []);

  const [isOnline, setIsonline] = useState(false);
  const [forceOffline, setForceOffline] = useState(true);

  useEffect (() => {
    const unsubscribe = NetInfo.addEventListener(state  => {
      if (!forceOffline){
        setIsonline(state.isConnected);
      }
    })
    return unsubscribe;
  }, [forceOffline]);

  const toggleOffline = () => {
    setForceOffline(!forceOffline);
    setIsonline(!forceOffline);
  }
  
  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <PaperProvider>
      <view style={{ flex: 1 }}>
        {!isOnline && (
          <view style={{ backgroundColor: 'red', padding: 10 }}>
            <Text style={{ color: "white", textAlign: 'center' }}>Modo Offline</Text>
          </view>
        )}
        <Button title={forceOffline ? 'Activar Online' : 'Activar Offline'} onPress={toggleOffline} />
        <NavigationContainer>
          {user ? (
            <Stack.Navigator>
              <Stack.Screen name="Home" component={Home} options={{ title: "Publicaciones" }} />
              <Stack.Screen name="CrearPublicacion" component={CrearPublicacion} options={{ title: "Nueva publicación" }} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginUsuario} options={{ title: "Iniciar sesión" }} />
              <Stack.Screen name="Registro" component={RegistroUsuario} options={{ title: "Crear cuenta" }} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </view>
    </PaperProvider>
  );
}
