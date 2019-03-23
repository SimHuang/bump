import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, TouchableWithoutFeedback } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config';
import { Button, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

class UserEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            events:null,
            userJoinedEvents: {},
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
                        userJoinedEvents: userObject.currentEvents
                    });
                }
            }).catch((error) => {});
    }

    goSeeEventDetail() {
        // Go to event detail page
        console.log('go to event detail page')
        this.props.navigation.navigate('EventDetail');
    }

    goToHomeScreen() {
        // ET Go Home
        this.props.navigation.navigate('EventFeed');
    }

    removeUserEvent(key) {
        const userID = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userID + '/currentEvents').child(key).remove();
        delete this.state.userJoinedEvents[key];
        this.setState({ userJoinedEvents: this.state.userJoinedEvents});
    }

    renderEventCards() {

        if(!this.state.userJoinedEvents)
        {
            return (
                <View>
                    <Text>{"Try joining an event!"}</Text>
                </View>
            )
        }

        const { events } = this.state;
        const { userJoinedEvents } = this.state;
        const uEventIds = Object.values(userJoinedEvents);
        const uEventKeys = Object.keys(userJoinedEvents);
        const eventIcons =
        {
            sports: require("../images/Sports.png"),
            party: require("../images/Party.png"),
            food: require("../images/Food.png"),
        }
        var selectedIcon;
        var event;

        return uEventIds.map((uEventId, index) => {

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
                            onPress={() => {this.removeUserEvent(uEventKeys[index])}}
                            title="Leave"
                            color="orange"
                            />
                        </CardAction>
                    </Card>
                </TouchableWithoutFeedback>
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

    render() {
        if(this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <View style={styles.background}>
                <Header
                    containerStyle={styles.header}
                    centerComponent={{ text: '' }}
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

export default UserEvents