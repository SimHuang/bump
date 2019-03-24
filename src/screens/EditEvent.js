import React from 'react';
import { firebaseConfig } from '../../config';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

import { Alert, TouchableOpacity, View, Text } from 'react-native';
import { Header, Icon, Input, Divider, Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Container, Content, Picker, Form, Item, List, ListItem } from "native-base";
import moment from "moment";

class EditEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventTitle: '',
      eventLocation: '',
      eventDescription: '',
      eventCategory: '',
      eventDate: '',
      eventAvailableSpots: '',
      message: '',
      eventID: '',
      isDateTimePickerVisible: false
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
                eventLocation: userObject.eventLocation,
                eventDescription: userObject.eventDescription,
                eventCategory: userObject.eventCategory,
                eventDate: userObject.eventDate,
                eventAvailableSpots: userObject.eventAvailableSpots
            });
        }
    });
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
    this.setState({eventDate: moment(date).format('MMMM Do YYYY, h:mm a')});
    this.hideDateTimePicker();
  };

  goToHomeScreen() {
    // ET Go Home
    this.props.navigation.navigate('EventFeed');
}

  EditEvent() {
    const key = this.state.eventID;
    firebase.database().ref('/events/' + key).update({
      eventTitle: this.state.eventTitle,
      eventLocation: this.state.eventLocation,
      eventDescription: this.state.eventDescription,
      eventCategory: this.state.eventCategory,
      eventDate: this.state.eventDate,
      eventAvailableSpots: this.state.eventAvailableSpots
    }, error => {
      if(error) {
        this.setState({message: 'Error editing event'});
      }
      else {
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
            containerStyle={{backgroundColor: '#1e9e88'}}
            leftComponent={<Icon name="angle-left" 
                                type="font-awesome"
                                color="#ffffff"
                                onPress={() => this.props.navigation.navigate('AppNavigator')}/>}
            rightComponent={<Icon name="home" 
                                type='font-awesome' 
                                onPress={() => this.goToHomeScreen()}
                                color="#ffffff"/>}
        />

<Input
          placeholder="Event Title" 
          value={this.state.eventTitle}
          onChangeText={(eventTitle) => this.setState({eventTitle})}/>

       <Input
          placeholder="Event Location" 
          value={this.state.eventLocation}
          onChangeText={(eventLocation) => this.setState({eventLocation})}/> 

        <Input
          multiline = {true}
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
              titleStyle={{color:'orange'}}
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
            color={'#ffffff'}
            title="Edit Event"
            titleStyle={{color:'orange'}}
            type = "outline"
            color="orange"
            onPress={() => this.EditEvent()} />
        </View>

        <Text>{this.state.message}</Text>
      </View>
    )
  }
}

export default EditEvent
