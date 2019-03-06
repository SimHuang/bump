import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../config';
import { Button, Header } from 'react-native-elements';

class EventFeed extends Component {

    componentDidMount() {
        // firebase.initializeApp(firebaseConfig);
    }

    logout() {
        firebase.auth().signOut().then(() => {
            console.log("user signed out");
            this.props.navigation.navigate('LoginNavigator');
        });
    }
    render() {
        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <Header
                    centerComponent={{ text: 'Home', style: { color: '#fff' } }}
                />
                <Text>Event FEED view</Text>
                <Button 
                    onPress={() => {this.logout()}}
                    title="Logout"/>
            </View>
        )
    }
}

export default EventFeed