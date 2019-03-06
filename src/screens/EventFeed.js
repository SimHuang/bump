import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../config';
import { Button } from 'react-native-elements';

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
            <View>
                <Text>Event FEED view</Text>
                <Button 
                    onPress={() => {this.logout()}}
                    title="Logout"/>
            </View>
        )
    }
}

export default EventFeed