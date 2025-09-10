import React from 'react';
import { View, Text, Button } from 'react-native'

const Principal = ( { navigation } ) => {

    return(
        <View>
            <Text>Bienvenido a Trueque Digital</Text>

            <Button title="Iniciar sesión" onPress={() => navigation.navigate('LoginUsuario') } />
            <Button title="Registrarse" onPress = {() => navigation.navigate('RegistroUsuario')} />  

        </View>
    )

}

export default Principal;