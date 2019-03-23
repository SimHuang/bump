import React from 'react';
import { firebaseConfig } from '../../config';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

import { StyleSheet, Alert, View, Text, Picker } from 'react-native';
import { Header, Icon, Input, Button } from 'react-native-elements';

class EditEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTitle: '',
      eventDescription: '',
      eventCategory: 'Sports',
      message: '',
      eventID: ''
    }
    this.database = firebase.database();
  }

  componentDidMount() {
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
    const eId = this.props.navigation.getParam('eventID');
    this.setState({eventID: eId});
    this.database.ref('/events/' + eId).once('value')
    .then(snapshot =>{
        if(snapshot.exists()){
            const userObject = snapshot.val();
            this.setState({
                eventTitle: userObject.eventTitle,
                eventDescription: userObject.eventDescription,
                eventCategory: userObject.eventCategory
            });
        }
    });
  }

  goToHomeScreen() {
    // ET Go Home
    this.props.navigation.navigate('EventFeed');
}

  EditEvent() {
    const key = this.state.eventID;
    firebase.database().ref('/events/' + key).update({
      eventTitle: this.state.eventTitle,
      eventDescription: this.state.eventDescription,
      eventCategory: this.state.eventCategory
    }, error => {
      if(error) {
        this.setState({message: 'Error editing event'});
      } else {
        this.setState({message: 'Event edited Successfully'});
      }
      setTimeout(() => {
        this.props.navigation.navigate('Hosted');
      }, 2000);
    });
  }

  render() {

    return (
      <View style={{backgroundColor: 'white', flex:1}}>
        <Header
            containerStyle={styles.header}
            leftComponent={<Icon name="angle-left" 
                                type="font-awesome" 
                                onPress={() => this.props.navigation.navigate('AppNavigator')}/>}
            rightComponent={<Icon name="home" 
                                type='font-awesome' 
                                onPress={() => this.goToHomeScreen()}
                                color="#ffffff"/>}
        />

        <Input
          placeholder="Event Title" 
          leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}
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
          color="orange"
          title="Edit Event"
          onPress={() => this.EditEvent()} />
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

export default EditEvent
