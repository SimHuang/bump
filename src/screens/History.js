import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Header } from 'react-native-elements';
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config'

class History extends Component {
    render() {
        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <Header
                    centerComponent={{ text: 'History', style: { color: '#fff' } }}
                />
                <Text>History</Text>
            </View>
        )
    }
}

export default History