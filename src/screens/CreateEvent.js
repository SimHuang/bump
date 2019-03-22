import React from 'react';
import { firebaseConfig } from '../../config';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

import { View, Text, Picker } from 'react-native';
import { Header, Icon, Input, Button } from 'react-native-elements';

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTitle: '', 
      eventDescription: '',
      eventCategory: '',
      message: ''
    }
  }

  componentDidMount() {
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
  }

  createEvent() {
    const newPostKey = firebase.database().ref().child('posts').push().key;
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/events/' + newPostKey).set({
      user: userId,
      eventTitle: this.state.eventTitle,
      eventDescription: this.state.eventDescription,
      dateCreated: new Date().getTime(),
      eventCategory: this.state.eventCategory
    }, error => {
      if(error) {
        this.setState({message: 'Error creating event'});
      } else {
        this.setState({message: 'Event created Successfully'});
      }
      setTimeout(() => {
        this.props.navigation.navigate('EventFeed');
      }, 2000);
    });

    /*TL TODO Review*/
    firebase.database().ref('/users/' + userId + '/postedEvents').push().set(newPostKey, error => {
        setTimeout(()=> {
          this.props.navigation.navigate('EventFeed');
        }, 1000);
    });
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex:1}}>
        <Header
          leftComponent={<Icon name="angle-left" 
                              type="font-awesome" 
                              onPress={() => this.props.navigation.navigate('AppNavigator')}/>}
          centerComponent={{ text: 'CreateEvent', style: { color: '#fff' } }}
        />

        <Input
          placeholder="Event Title" 
          value={this.state.eventTitle}
          onChangeText={(eventTitle) => this.setState({eventTitle})}/>

        <Input
          placeholder="Event Description"
          value={this.state.eventDescription}
          onChangeText={eventDescription => this.setState({eventDescription})} />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex:.5}}>
            <Text>{'Event Category:'}</Text>
          </View>
          <View style={{flex:.2}}>
            <Picker
              mode="dropdown"
              selectedValue={this.state.eventCategory}
              style={{height: 50, width: 500}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({eventCategory: itemValue})
              }>
              <Picker.Item label="Sports" value="Sports" />
              <Picker.Item label="Party" value="Party" />
              <Picker.Item label="Food" value="Food" />
            </Picker>
          </View>
        </View>

        <Button
          title="Create Event" 
          onPress={() => this.createEvent()} />
        <Text>{this.state.message}</Text>
      </View>
    )
  }
}

export default CreateEvent
