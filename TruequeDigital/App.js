import React, { useState } from 'react';
import { View } from 'react-native';
import Principal from './src/Components/Principal';
import LoginUsuario from './src/Components/LoginUsuario'; 
import RegistroUsuario from './src/Components/RegistroUsuario';
import Home from './src/Components/Home';
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
