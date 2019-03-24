import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, TouchableWithoutFeedback } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config';
import { Button, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

class Hosted extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            events:null,
            userPostedEvents: {},
        }
        this.database = firebase.database();
    }

    componentDidMount() {
        this.database.ref('/events').once('value')
            .then(snapshot => {
                console.log(snapshot.val());
                this.setState({isLoading: false, events:snapshot.val()});
            });

        const userID = firebase.auth().currentUser.uid;
        this.database.ref('/users/' + userID).once('value')
            .then(snapshot => {
                if(snapshot.exists()) {
                    const userObject = snapshot.val();
                    this.setState({
                        userPostedEvents: userObject.postedEvents
                    });
                }
            });
    }

    goSeeEventDetail() {
        // Go to event detail page
        this.props.navigation.navigate('EventDetail');
    }

    goToHomeScreen() {
        // ET Go Home
        this.props.navigation.navigate('EventFeed');
    }

    goEditEvent(key) {
        //Go to create event page to edit event
        this.props.navigation.navigate('EditEvent', {eventID: key});
    }

    removeUserEvent(key, value) {
        const userID = firebase.auth().currentUser.uid;

        //Remove event from list of user posted events
        firebase.database().ref('/users/' + userID + '/postedEvents').child(key).remove();
        delete this.state.userPostedEvents[key];
        this.setState({ userPostedEvents: this.state.userPostedEvents});

        //Remove event from master list of events
        firebase.database().ref('/events').child(value).remove();
        this.setState({ events: this.state.events});
    }

    removeDeadEvent(key, value) {
        const userID = firebase.auth().currentUser.uid;

        //Remove event from list of user posted events
        firebase.database().ref('/users/' + userID + '/postedEvents').child(key).remove();
        delete this.state.userPostedEvents[key];
        this.setState({ userPostedEvents: this.state.userPostedEvents});
    }

    renderEventCards() {

        if(!this.state.userPostedEvents)
        {
            return (
                <View>
                    <Text>{"Try posting an event!"}</Text>
                </View>
            )
        }

        const { events } = this.state;
        const { userPostedEvents } = this.state;
        const uEventIds = Object.values(userPostedEvents);
        const uEventKeys = Object.keys(userPostedEvents);
        const eventIcons =
        {
            sports: require("../images/Sports.png"),
            party: require("../images/Party.png"),
            food: require("../images/Food.png"),
        }
        var selectedIcon;
        var event;

        return uEventIds.map((uEventId, index) => {

            if (!events[uEventId])
            {
                //Remove the entry and move on
                this.removeDeadEvent(uEventKeys[index]);
                return;
            }
            else
            {
                //Valid entry, proceed to display
                event = events[uEventId];
                switch (event.eventCategory)
                {
                    case 'Sports': selectedIcon = eventIcons.sports; break;
                    case 'Party': selectedIcon = eventIcons.party; break;
                    case 'Food': selectedIcon = eventIcons.food; break;
                    default: selectedIcon = eventIcons.food; break;
                }
    
                return (
                    <TouchableWithoutFeedback
                        onPress={() => { this.goSeeEventDetail() }}
                    >
                        <Card>
                            <CardImage 
                                source={selectedIcon}
                                title={event.eventCategory}
                            />
                            <CardTitle 
                                title={event.eventTitle}
                                subtitle="Terence Lau"
                            />
                            <CardContent text= {event.eventDescription} />
                            <CardAction 
                                separator={true} 
                                inColumn={false}>
                                <CardButton
                                onPress={() => {this.goEditEvent(uEventIds[index])}}
                                title="Edit"
                                color="orange"
                                />
                                <CardButton
                                onPress={() => {this.removeUserEvent(uEventKeys[index], uEventIds[index])}}
                                title="Cancel"
                                color="orange"
                                />
                            </CardAction>
                        </Card>
                    </TouchableWithoutFeedback>
                );
            }
        });
    }

    renderLoading() {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    render() {
        if(this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <View style={styles.background}>
                <Header
                    containerStyle={styles.header}
                    centerComponent={{ text: ''}}
                    leftComponent={<Icon name="settings" color = "#ffffff"/>}
                    rightComponent={<Icon name="home" 
                    type='font-awesome' 
                    onPress={() => this.goToHomeScreen()}
                    color="#ffffff"
                    />}
                />
                <ScrollView contentContainerStyle = {styles.zeroMarginVert}>
                    {this.renderEventCards()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    header: {
        backgroundColor: '#1e9e88'
    },

    background: {
        backgroundColor: '#ECF2F6',
        flex: 1
    },

    zeroMarginVert: {
        marginTop: 0,
        marginBottom: 0
    },
});

export default Hosted