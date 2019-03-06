import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config';
import { Header } from 'react-native-elements';

class UserEvents extends Component {
    render() {
        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <Header
                centerComponent={{ text: 'Your events', style: { color: '#fff' } }}
                />
                <Text>User events</Text>
            </View>
        )
    }
}

export default UserEvents