import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, TouchableHighlight } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config';
import { Button, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import GlobalContext, { EventContext } from '../context/GlobalContext';
import { Spinner } from 'native-base';

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
        let value = this.context;

        this.props.navigation.addListener('willFocus', (route) => { 
            this.database.ref('/events').once('value')
                .then(snapshot => {
                    console.log(snapshot.val());
                    this.setState({isLoading: false, events:snapshot.val()});
                    value.setCurrentEvents(snapshot.val());
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
        });
    }

    goSeeEventDetail(event, value) {
        // Go to event detail page
        console.log('The event you selected  ' + event);
        value.setSelectedEvent(event, () => {
            this.props.navigation.navigate('EventDetail');
        });
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

    renderEventCards(value) {

        if(!this.state.userJoinedEvents)
        {
            return (
                <View
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 20
                }}
                >
                    <Text>Join some events now!</Text>
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

            if (!events[uEventId])
            {
                //Remove the entry and move on
                this.removeUserEvent(uEventKeys[index]);
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
                    <TouchableHighlight
                        onPress={() => { this.goSeeEventDetail(uEventIds[index], value) }}
                        underlayColor="white"
                    >
                        <Card>
                            <CardImage 
                                source={selectedIcon}
                                title={event.eventLocation}
                            />
                            <CardTitle 
                                avatarSource={require('../images/User.png')}
                                title={event.eventTitle}
                                subtitle={event.eventDate}
                            />
                            <CardContent text= {event.eventDescription} />
                            <CardAction 
                                separator={true} 
                                inColumn={false}>
                                <CardButton
                                    onPress={() => {this.removeUserEvent(uEventKeys[index])}}
                                    onPress={() => {Alert.alert(
                                                        'Leaving Event',
                                                        'Are you sure?',
                                                        [
                                                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                                                        {text: 'OK', onPress: () => {this.removeUserEvent(uEventKeys[index])}}
                                                        ]);}}
                                    title="Leave"
                                    color="orange"
                                />
                            </CardAction>
                        </Card>
                    </TouchableHighlight>
                );
            }
        });
    }

    renderLoading() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#fff'
              }}>
                {/* <Text>Loading...</Text> */}
                <Spinner color="#1e9e88"/>
            </View>
        );
    }

    render() {

        if(this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <View style={styles.background}>
                <EventContext.Consumer>
                    {(value) => {
                        console.log(value);
                        return (
                            <React.Fragment>
                                <Header
                                    containerStyle={styles.header}
                                    centerComponent={{ text: 'Joined Events', style: { color: '#fff' } }}
                                    rightComponent={<Icon name="home"
                                        type='font-awesome'
                                        onPress={() => this.goToHomeScreen()}
                                        color="#ffffff"
                                    />}
                                />
                                <ScrollView contentContainerStyle = {styles.zeroMarginVert}>
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