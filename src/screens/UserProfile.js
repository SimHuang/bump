import React from 'react';
import firebase from '@firebase/app';

import { View, Text, StyleSheet } from 'react-native';
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
    const userId = firebase.auth().currentUser.uid;
    this.database.ref('/users/' + userId).update({firstName: this.state.firstName,
                                                  lastName: this.state.lastName});
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex:1}}>
        <Header
          containerStyle={styles.header}
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1e9e88'
  }
});

export default UserProfile
