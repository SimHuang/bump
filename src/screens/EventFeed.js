import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../config';
import { Card, Button, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';

import GlobalContext, { EventContext } from '../context/GlobalContext';

class EventFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            user: null,
            events: null,
            filter: null,
            eventRemoved: null
        }
        this.database = firebase.database();
        // this.myContext = null;
    }

    componentDidMount() {
        let value = this.context;
        // firebase.initializeApp(firebaseConfig);
        const userID = firebase.auth().currentUser.uid;
        //get event info
        this.database.ref('/events').once('value')
            .then(snapshot => {
                this.setState({events:snapshot.val()});
                value.setCurrentEvents(snapshot.val());

                //get user info
                this.database.ref('/users/' + userID).once('value')
                .then(snapshot => {
                    value.setFilter(snapshot.val().filter);
                    this.setState({isLoading: false, user:snapshot.val(), filter: snapshot.val().filter});
                    // value.setCurrentEvents(snapshot.val());
                });

            });
        
        //add listener for category change
        this.database.ref('/users/' + userID).on('child_changed', (data) => {
            this.setState({filter: data.val()});
            value.setFilter(data.val());
        });
    }

    /**
     * This gets called when we update the user list
     */
    componentDidUpdate() {
        let value = this.context;
        if (value.shouldUpdateSetting) {
            return true;
        }
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
        // let value = this.context;
        // Go to event detail page
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
                            <Text>{event.eventCategory}</Text>
                            <Text>{event.eventDescription}</Text>
                        </View>
                    </Card>
                </TouchableHighlight>
            );
        });
    }

    renderFilteredEvents(value) {
        const { events } = this.state;
        const eventIds = Object.keys(events);
        const eventDetails = Object.values(events);

        let withCategory = eventDetails.filter((event) => {
            return event.eventCategory === this.state.filter;
        });

        let withoutCategory  = eventDetails.filter((event) => {
            return event.eventCategory !== this.state.filter;
        });

        let filteredEvents = [...withCategory, ...withoutCategory];

        return filteredEvents.map((event, index) => {
            return (
                <TouchableHighlight
                    onPress={() => { this.goSeeEventDetail(eventIds[index], value) }}
                    underlayColor="white"
                >
                    <Card title={event.eventTitle} 
                        key={eventIds[index]}>
                        <View  >
                            <Text>{event.eventCategory}</Text>
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
        console.log(this.state);
        if(this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <View style={{backgroundColor: 'white', flex:1}}>
                <EventContext.Consumer>
                    {(value) => {
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
                                    {this.state.filter && this.state.filter !== 'None' ? this.renderFilteredEvents(value) : this.renderEventCards(value)}
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
