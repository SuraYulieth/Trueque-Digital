// App.js
import React, { useEffect, useState, useMemo } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import NetInfo from "@react-native-community/netinfo"
// temporarily avoid using react-native-paper to isolate runtime crash
import Home from "./src/Pantallas/Home";
import LoginUsuario from "./src/Pantallas/LoginUsuario";
import RegistroUsuario from "./src/Pantallas/RegistroUsuario";
import CrearPublicacion from "./src/Pantallas/crearPublicacion";
// removed Paper Button import (using fallback TouchableOpacity instead)
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from './firebaseConfig';
import MisSolicitudes from "./src/Pantallas/MisSolicitudes";
import Mensajes from "./src/Pantallas/Mensajes";


const Stack = createNativeStackNavigator();

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught', error, info);
    this.setState({ error, info });
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Se produjo un error en la UI</Text>
          <Text>{String(this.state.error)}</Text>
          <Text style={{ marginTop: 12, color: '#666' }}>{this.state.info?.componentStack}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [networkOnline, setNetworkOnline] = useState(false);
  const [forceOffline, setForceOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  const effectiveOnline = useMemo(
    () => !forceOffline && networkOnline,
    [forceOffline, networkOnline]
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected =
        !!state.isConnected && (state.isInternetReachable !== false);
      setNetworkOnline(connected);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (forceOffline) {
      disableNetwork(db).catch(() => {});
    } else {
      enableNetwork(db).catch(() => {});
    }
  }, [forceOffline]);

  const toggleOffline = () => {
    setForceOffline(prev => !prev);
  };
  
  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Re-enable navigation but keep screens minimal to isolate failures.
  // Render Home directly (without react-navigation) to isolate react-native-screens/native-stack
  if (user) {
    // provide a minimal navigation stub so Home's navigation.navigate calls won't crash when used
    const fakeNav = {
      navigate: (name, params) => {
        console.log('navigate called', name, params);
      },
      goBack: () => {},
    };
    return (
      <ErrorBoundary>
        <View style={{ flex: 1 }}>
          <Home
            navigation={fakeNav}
            effectiveOnline={effectiveOnline}
            forceOffline={forceOffline}
            toggleOffline={toggleOffline}
          />
        </View>
      </ErrorBoundary>
    );
  }

  // unauthenticated: render login/register directly
  return (
    <ErrorBoundary>
      <View style={{ flex: 1 }}>
        <LoginUsuario />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  offlineButton: {
    margin: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  offlineButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
