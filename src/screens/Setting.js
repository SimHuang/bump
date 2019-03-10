import React from 'react';

import { View, Text } from 'react-native';
import { Header, Button } from 'react-native-elements';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../config';

class Setting extends React.Component {

  logout() {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('LoginNavigator');
    });
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex:1}}>
        <Header
          centerComponent={{ text: 'Setting', style: { color: '#fff' } }}
        />
        <Button 
          title="Log Out"
          onPress={() => this.logout()}/>
      </View>
    )
  }
}

export default Setting
