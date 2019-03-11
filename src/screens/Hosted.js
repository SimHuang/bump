import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Header } from 'react-native-elements';
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config'

class Hosted extends Component {
    render() {
        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <Header
                    centerComponent={{ text: 'Hosted', style: { color: '#fff' } }}
                />
                <Text>Hosted</Text>
            </View>
        )
    }
}

export default Hosted