import React from 'react';
import { firebaseConfig } from '../../config';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

import { Alert, TouchableOpacity, View, Text } from 'react-native';
import { Header, Icon, Input, Divider, Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Container, Content, Picker, Form, Item, List, ListItem } from "native-base";

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTitle: '',
      eventDescription: '',
      eventCategory: '',
      eventDate: '',
      eventAvailableSpots: '',
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

    if(!this.state.eventTitle || 
       !this.state.eventDescription || 
       !this.state.eventCategory || 
       !this.state.eventDate || 
       !this.state.eventAvailableSpots)
    {
      Alert.alert("Please fill in all fields");
      return;
    }

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
          containerStyle = {{backgroundColor: '#1e9e88' }}
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
            <ListItem>
              <Text>Select Category</Text>
            </ListItem>
          </View>
          <View style={{flex:.5}}>
          <Picker
            iosIcon={<Icon name="arrow-down" />}
            mode='dropdown'
            selectedValue={this.state.eventCategory}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({eventCategory: itemValue})
            }>
            <Picker.Item it label="..." value='' />
            <Picker.Item label="Sports" value="Sports" />
            <Picker.Item label="Party" value="Party" />
            <Picker.Item label="Food" value="Food" />
          </Picker>
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex:.5}}>
          <ListItem>
              <Text>Select DateTime</Text>
            </ListItem>
          </View>
          <View style={{flex:.5}}>
            <Button
              type = "outline"
              title={ !this.state.eventDate ? "..." : this.state.eventDate}
              onPress={this.showDateTimePicker} />
          </View>

          <DateTimePicker
            mode="datetime"
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
        </View>

        <View style={{flex:1, justifyContent: 'flex-end', marginBottom:36}}>
          <Button
            title="Create Event" 
            type = "outline"
            color="orange"
            onPress={() => this.createEvent()} />
        </View>

        <Text>{this.state.message}</Text>
      </View>
    )
  }
}

export default CreateEvent
