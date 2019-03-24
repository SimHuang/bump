import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import {Platform, StyleSheet, Text, View, ImageBackground, TextInput, Image, TouchableOpacity} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config';

import { Input, Button } from 'react-native-elements';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null
        }
    }
    componentDidMount() {
        if(!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }
        this.trackAuthenticateState();
    }

    componentWillUnmount() {
        if(this.unsubscribe) {
            console.log('unsubscribe auth in login');
            this.unsubscribe();
        }
    }

    signupOnPressHandler() {
        let { navigation } = this.props;
        navigation.navigate('Signup');
    }

    authenticate(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
           Alert.alert("Invalid Username/Password");
           console.log(error);
        });
    }

    // Method to track the current authenticate state
    // Once user logs in we can do things such as go to activity screen
    trackAuthenticateState() {
        let { navigation } = this.props; 
        this.unsubscribe =  firebase.auth().onAuthStateChanged(user => {
            if(user) {
                console.log('user logged in successfully');
                navigation.navigate('EventFeed');
            }
        });
    }

    render() {
        console.log('opening loging screen');
        return (
            <View style={styles.container}>
                <Image source={require('../../images/logo.png')} style={styles.logo} />
                <View alignItems={'center'}>
                    <TextInput style={styles.input}
                        autoCapitalize='none'
                        placeholder="Username"
                        placeholderTextColor="white"
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email})}
                    />
                    <TextInput style={styles.input}
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="white"
                        value={this.state.password}
                        onChangeText={(password) => this.setState({password})}
                    />

                <TouchableOpacity style={styles.button}
                    onPress={()=> {
                        this.authenticate(this.state.email, this.state.password)}
                    }>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                </View>

                <Button color={'#2980b6'}
                    type="clear"
                    title="Create New Account"
                    onPress={()=> this.signupOnPressHandler()}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#2c3e50',
        flexGrow: 1,
    },
    button: {
        height: 40,
        backgroundColor: '#2980b6',
        width: '60%'
    },
    input: {
        color: 'white',
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        width: '80%',
    },
    logo: {
        resizeMode: 'contain',
        width: 400,
        height: 100,
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        paddingTop: 5
    }
})

export default Login