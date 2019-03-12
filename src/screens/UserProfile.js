import React from 'react';
import firebase from '@firebase/app';

import { View, Text } from 'react-native';
import { Header, Image, Button, Input } from 'react-native-elements';

class UserProfile extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    message: ''
  }

  database = firebase.database();

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.database.ref('/users/' + userId).once('value')
      .then(snapshot => {
        if(snapshot) {
          const userObject = snapshot.val();
          this.setState({
            firstName: userObject.firstName,
            lastName: userObject.lastName
          });
        }
      })
  }

  saveUserProfile() {
    let updates = {};
    const userId = firebase.auth().currentUser.uid;
    const updateData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName
    }
    updates['/users/' + userId] = updateData;
    this.database.ref().update(updates);
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex:1}}>
        <Header
          centerComponent={{ text: 'profile', style: { color: '#fff' } }}
        />
        <Image/>
        <Text>First Name</Text>
        <Input 
          value={this.state.firstName}
          onChangeText={value => this.setState({firstName: value})}
        />
        <Text>Last Name</Text>
        <Input 
          value={this.state.lastName}
          onChangeText={value => this.setState({lastName: value})}
        />
        <Button
          title="Save Changes"
          onPress={() => this.saveUserProfile()}
        />
        <Text>{this.state.message}</Text>
      </View>
    )
  }
}

export default UserProfile
