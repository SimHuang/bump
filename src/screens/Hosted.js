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
        console.log('go to event detail page')
        this.props.navigation.navigate('EventDetail');
    }

    goToHomeScreen() {
        // ET Go Home
        this.props.navigation.navigate('EventFeed');
    }

    removeUserEvent(key) {
        const userID = firebase.auth().currentUser.uid;
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
                            title="Edit"
                            color="orange"
                            />
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
                    centerComponent={{ text: '', style: { color: 'fff' } }}
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

    button: {
        borderRadius: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        backgroundColor: '#1addad'
    },

    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',

    },

    zeroMarginHor: {
        marginLeft: 0,
        marginRight: 0,
    },

    zeroMarginVert: {
        marginTop: 0,
        marginBottom: 0
    },

    zeroMargin: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
    },

    border: {
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#036482'
    },

    buttonContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
});

export default Hosted