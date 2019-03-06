import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';

import firebase from '@firebase/app';

class EventDetail extends Component {
    render() {
        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <Header
                    centerComponent={{ text: 'Detail', style: { color: '#fff' } }}
                />
                <Text>Event detail view</Text>
            </View>
        )
    }
}

export default EventDetail