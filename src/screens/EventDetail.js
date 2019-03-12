import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';

import GlobalContext, { EventContext } from '../context/GlobalContext';

import firebase from '@firebase/app';

class EventDetail extends Component {

    joinEvent(eventId) {
        const myUserId = firebase.auth().currentUser.uid;

        firebase.database().ref('/users/' + myUserId + '/currentEvents').push().set(eventId, error => {
            setTimeout(() => {
              this.props.navigation.navigate('EventFeed');
            }, 1000);
          });
    }

    renderEventDetails(eventDetail) {
        return (
            <React.Fragment>
                <Text>Title</Text>
                <Text>{eventDetail.eventTitle}</Text>
                <Text>Category</Text>
                <Text>{eventDetail.eventCategory}</Text>
                <Text>Description</Text>
                <Text>{eventDetail.eventDescription}</Text>
            </React.Fragment>
        )
    }

    render() {
        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <EventContext.Consumer>
                    {(value) => {
                        const currentEvent = value.currentEvents[value.selectedEvent];
                        return (
                            <React.Fragment>
                            <Header
                                centerComponent={{ text: 'Detail', style: { color: '#fff' } }}
                                rightComponent={<Icon name="times"
                                type="font-awesome"
                                onPress={() => this.props.navigation.navigate('AppNavigator')}/>}
                                />
                            <Text>Event detail view</Text>
                            {this.renderEventDetails(currentEvent)}
                            <Button title="Join Event"
                                    onPress={() => this.joinEvent(value.selectedEvent)}/>
                        </React.Fragment>
                        );
                    }}
                </EventContext.Consumer>
            </View>
        )
    }
}

export default EventDetail