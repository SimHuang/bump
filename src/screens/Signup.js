import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Input, Button } from 'react-native-elements';

import { firebaseConfig } from '../../config';
import firebase from '@firebase/app';
import '@firebase/auth'

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "email": null,
            "firstName": null,
            "lastName": null, 
            "password": null,
            "passwordAgain": null
        }
    }
    componentDidMount() {
        //firebase.initializeApp(firebaseConfig);
    }

    loginOnpressHanlder(email, password) {
        console.log('go to login screen');
    }

    createAccount() {
        firebase.auth().createUserWithEmailAndPassword("simhuang12@yahoo.com", "expertnerd123")
        .catch((error) => {
            console.log('error' + error);
        });
    }

    render() {
        return (
            <View>
                <Input
                    placeholder="Enter email"
                />
                <Input
                    placeholder="Enter username"
                />
                <Input
                    placeholder="Enter first name"
                />
                <Input
                    placeholder="Enter last name"
                />
                <Input
                    placeholder="Enter password"
                />
                <Input
                    placeholder="Enter password again"
                />
                <Button 
                    title="Create Account"
                    onPress={()=> this.createAccount()}/>
                <Button 
                    title="Already have an account? Log in."
                    type="clear"
                    onPress={() => this.loginOnpressHanlder()}
                />
            </View>
        )
    }
}

export default Signup