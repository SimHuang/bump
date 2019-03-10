import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Header, Icon } from 'react-native-elements';

import firebase from '@firebase/app';

class EventDetail extends Component {
    render() {
        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <Header
                    centerComponent={{ text: 'Detail', style: { color: '#fff' } }}
                    rightComponent={<Icon name="times"
                                        type="font-awesome"
                                        onPress={() => this.props.navigation.navigate('AppNavigator')}/>}
                />
                <Text>Event detail view</Text>
            </View>
        )
    }
}

export default EventDetail