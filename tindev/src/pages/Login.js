import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native';

import logo from '../assets/logo.png';

import api from '../services/api';

export default function Login({navigation}) {
    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', {user});
            }
        })
    })

    async function handleLogin() {
        const response = await api.post('/devs', {username: user});

        const {_id} = response.data;

        await AsyncStorage.setItem('user', _id);

        navigation.navigate('Main', {user: _id});

    }
    return (
        <View style={styles.container}>
            <Image source={logo} />

            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                placeholder="Digite seu usuário do GitHub"
                placeholderTextColor="#999"
                value={user}
                onChangeText={setUser}
            />

            <TouchableOpacity 
            onPress={handleLogin} 
            style={styles.button}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },

    button: {
        backgroundColor: '#df4723',
        height: 46,
        alignSelf: 'stretch',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
})
