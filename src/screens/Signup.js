import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Input, Button, Header } from 'react-native-elements';
import { Toast } from 'native-base';

import { firebaseConfig } from '../../config';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "email": null,
            "firstName": null,
            "lastName": null, 
            "password": null,
            "passwordAgain": null,
            "message": null
        }
        this.unsubscribe = null;
        this.database = null;
    }

    componentDidMount() {
        //firebase.initializeApp(firebaseConfig);
        this.database = firebase.database();
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            console.log('attempting atuehtnication ');
            if (user) {
                this.writeUserToDB(user);
                this.setState({message: 'user created'});
                this.props.navigation.navigate('AppNavigator');
            } else {
                //not signed in implementation
            }
        });
    }

    componentWillUnmount() {
        if(this.unsubscribe) {
            this.unsubscribe();
        }
    }

    writeUserToDB(user) {
        const userInfo = this.state;
        const userId = firebase.auth().currentUser.uid;
        console.log('creating user object');
        this.database.ref('/users/' + userId).set({
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            fullName: userInfo.firstName + userInfo.lastName
        })
    }

    loginOnpressHanlder(email, password) {
        this.props.navigation.navigate('Login');
        this.setState({message: this.state.firstName});
    }

    createAccount() {
        if(this.validateForm()) {
            const { email, password } = this.state;
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch((message) => {
                console.log('message' + message);
            });
        }
        // this.props.navigation.navigate('AppNavigator');
    }

    validateForm() {
        const userInput = this.state;
        if (!userInput.email || !userInput.email.includes('@')) {
            // this.setState({message: 'Please enter a valid email.'})
            Toast.show({
                text: 'Please enter a valid email'
            });
            return false;
        }

        if(!userInput.firstName || userInput.firstName === '') {
            // this.setState({message: 'Please enter a valid first name'});
            Toast.show({
                text: 'First Name Field Required'
            });
            return false;
        }
        
        if (!userInput.lastName || userInput.lastName === '') {
            // this.setState({message: 'Please enter a valid last name'})
            Toast.show({
                text: 'Last Name Field Required'
            });
            return false;
        }

        if (!userInput.password || userInput.password === '') {
            // this.setState({message: 'Please enter a valid password'});
            Toast.show({
                text: 'Please enter a valid password'
            });
            return false;
        }

        if (!userInput.passwordAgain || userInput.passwordAgain === '') {
            // this.setState({message: 'Password does not match.'});
            Toast.show({
                text: 'Password does not match'
            });
            return false;
        }
        // console.log('error craeting account');
        return true;
    }

    hidemessageMessage() {
        setTimeout(() => {
            this.setState({message: ''});
        }, 1000);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>Create an Account</Text>
                <Input
                    placeholder="Enter email"
                    value={this.state.email}
                    onChangeText={(text) => { this.setState({email: text})}}
                    name="email"
                />
                <Input
                    placeholder="Enter first name"
                    value={this.state.firstName}
                    onChangeText={text => { this.setState({firstName: text})}}
                    name="firstName"
                />
                <Input
                    placeholder="Enter last name"
                    value={this.state.lastName}
                    onChangeText={text => { this.setState({lastName: text})}}
                    name="lastName"
                />
                <Input
                    placeholder="Enter password"
                    onChangeText={text => { this.setState({password: text})}}
                    value={this.state.password}
                    name="password"
                    type="password"
                />
                <Input
                    placeholder="Enter password again"
                    onChangeText={text => { this.setState({passwordAgain: text})}}
                    value={this.state.passwordAgain}
                    name="passwordAgain"
                    type="password"
                />
                <Text>{this.state.message}</Text>
                <View style={styles.btn}>
                    <Button 
                        title="Create Account"
                        onPress={()=> this.createAccount()}
                    />
                    <Button 
                        buttonStyle={{
                            color:'#1e9e88'
                            
                        }}
                        style={{
                            color:'#1e9e88'
                        }}
                        title="Already have an account? Log in."
                        type="clear"
                        onPress={() => this.loginOnpressHanlder()}
                        />  
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        marginTop: 30
    },
    label: {
        color: '#1e9e88',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
        marginLeft: 10,
        marginBottom: 10
    },
    btn: {
        margin: 4
    },
    smallBtn: {
        fontSize: 10,
        color: '#1e9e88',
    }
});

export default Signup