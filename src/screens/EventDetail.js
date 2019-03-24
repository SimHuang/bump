import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import { Container, Content, Item, Input } from 'native-base';

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
                <Container>
                    <Content>
                        <Item disabled>
                            <Input disabled placeholder={"Title: " + eventDetail.eventTitle}/>
                        </Item>
                        <Item disabled>
                            <Input disabled placeholder={"Category: " + eventDetail.eventCategory}/>
                        </Item>
                        <Item disabled>
                            <Input disabled placeholder={"Date: " + eventDetail.eventDate}/>
                        </Item>
                        <Item disabled>
                            <Input disabled placeholder={"Available Spots: " + eventDetail.eventAvailableSpots}/>
                        </Item>
                        <Item disabled>
                            <Text>{eventDetail.eventDescription}</Text>
                        </Item>
                    </Content>
                </Container>
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