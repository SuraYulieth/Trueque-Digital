import React, { useState } from 'react';
import { View } from 'react-native';
import Principal from './src/Pantallas/Principal';
import LoginUsuario from './src/Pantallas/LoginUsuario'; 
import RegistroUsuario from './src/Pantallas/RegistroUsuario';
import Home from './src/Pantallas/Home';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 


const Stack = createStackNavigator(); 

export default function App() {

 return (
   <NavigationContainer> 
      <Stack.Navigator initialRouteName="Principal"> 
         <Stack.Screen name="Principal" component={Principal} /> 
         <Stack.Screen name="LoginUsuario" component={LoginUsuario} /> 
         <Stack.Screen name="RegistroUsuario" component={RegistroUsuario} /> 
         <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator> 
   </NavigationContainer> 
 );

}
