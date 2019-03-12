import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../config';
import { Card, Button, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import GlobalContext, { EventContext } from '../context/GlobalContext';

class EventFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            events: null
        }
        this.database = firebase.database();
        // this.myContext = null;
    }

    componentDidMount() {
        let value = this.context;
        // firebase.initializeApp(firebaseConfig);
        this.database.ref('/events').once('value')
            .then(snapshot => {
                this.setState({isLoading: false, events:snapshot.val()});
                value.setCurrentEvents(snapshot.val());
            });
    }

    logout() {
        firebase.auth().signOut().then(() => {
            console.log("user signed out");
            this.props.navigation.navigate('LoginNavigator');
        });
    }

    goToCreateEventScreen() {
        this.props.navigation.navigate('CreateEvent');
    }

    goSeeEventDetail(event, value) {
        // Go to event detail page
        console.log('The event you selected  ' + event);
        value.setSelectedEvent(event, () => {
            this.props.navigation.navigate('EventDetail');
        });
    }

    renderEventCards(value) {
        const { events } = this.state;
        const eventIds = Object.keys(events);
        const eventDetails = Object.values(events);

        return eventDetails.map((event, index) => {
            return (
                <TouchableHighlight
                    onPress={() => { this.goSeeEventDetail(eventIds[index], value) }}
                    underlayColor="white"
                >
                    <Card title={event.eventTitle} 
                        key={eventIds[index]}>
                        <View  >
                            <Text>{event.eventDescription}</Text>
                        </View>
                    </Card>
                </TouchableHighlight>
            );
        });
    }

    renderLoading() {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    setUserSelectedEvent() {

    }

    render() {
        if(this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <EventContext.Consumer>
                    {(value) => {
                        console.log(value);
                        return (
                            <React.Fragment>
                                <Header
                                    centerComponent={{ text: 'Home', style: { color: '#000' } }}
                                    rightComponent={<Icon name="plus" 
                                    type='font-awesome' 
                                    onPress={() => this.goToCreateEventScreen()}
                                    color="#000"
                                />}
                                containerStyle={{ backgroundColor: '#fff' }}
                                />
                                <ScrollView>
                                    {this.renderEventCards(value)}
                                </ScrollView>
                            </React.Fragment>
                        )}
                    }
                </EventContext.Consumer>
            </View>
        )
    }
}

EventFeed.contextType = EventContext;

export default EventFeed