import React from 'react';
import { firebaseConfig } from '../../config';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

import { Alert, TouchableOpacity, View, Text, Picker } from 'react-native';
import { Header, Icon, Input, Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTitle: '',
      eventDescription: '',
      eventCategory: 'Sports',
      eventDate: '',
      eventAvailableSpots: 1,
      message: '',
      isDateTimePickerVisible: false
    }
  }
  componentDidMount() {
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
  }

  validateNumericInput(text)
  {
    let newText = '';
    let numbers = '0123456789';

    for (var i=0; i < text.length; i++) {
        if(numbers.indexOf(text[i]) > -1 ) {
            newText = newText + text[i];
        }
        else {
            // your call back function
            alert("please enter numbers only");
        }
    }
    this.setState({ eventAvailableSpots: newText });
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  handleDatePicked = (date) => {
    this.setState({eventDate: date.toString()});
    this.hideDateTimePicker();
  };

  createEvent() {
    const newPostKey = firebase.database().ref().child('posts').push().key;
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/events/' + newPostKey).set({
      user: userId,
      eventTitle: this.state.eventTitle,
      eventDescription: this.state.eventDescription,
      eventCategory: this.state.eventCategory,
      eventDate: this.state.eventDate,
      eventAvailableSpots: this.state.eventAvailableSpots,
      dateCreated: new Date().getTime(),
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

        <Input
          keyboardType='numeric'
          placeholder="Available Spots"
          value={this.state.eventAvailableSpots}
          maxLength={5}
          onChangeText={(text)=>this.validateNumericInput(text)} />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex:.5}}>
            <Text>{'   Select Category:'}</Text>
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

        <View style={{ flex: 1 }}>
          <Button
            title="Select Time"
            onPress={this.showDateTimePicker} />
          <DateTimePicker
            mode="datetime"
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
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
