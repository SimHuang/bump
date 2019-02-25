import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
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
        firebase.initializeApp(firebaseConfig)
        this.trackAuthenticateState();
    }

    signupOnPressHandler() {
        console.log('money bunny');
        let { navigation } = this.props;
        console.log('hello world')
        navigation.navigate('Signup');
    }

    authenticate(email, password) {
        firebase.auth().signInWithEmailAndPassword("simhuang@yahoo.com", "expertnerd123")
        .catch((error) => {
           console.log(error);
        });
    }

    // Method to track the current authenticate state
    // Once user logs in we can do things such as go to activity screen
    trackAuthenticateState() {
        let { navigation } = this.props; 
        firebase.auth().onAuthStateChanged(user => {
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
                <Text>Login page</Text>
                <Input
                    placeholder="Username"
                />
                <Input
                    placeholder="Password"
                />
                <Button 
                    onPress={()=> this.authenticate()}
                    style={styles.button}
                    title="Login"/>
                <Button
                    type="clear"
                    title="Create New Account"
                    onPress={()=> this.signupOnPressHandler()}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    button: {
        marginTop: 20,
        width: 250
    }
})

export default Login