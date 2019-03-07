import React from 'react';

import { View, Text } from 'react-native';
import { Header } from 'react-native-elements';

class UserProfile extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: 'white', flex:1}}>
        <Header
          centerComponent={{ text: 'profile', style: { color: '#fff' } }}
        />
        <Text>user profile</Text>
      </View>
    )
  }
}

export default UserProfile
