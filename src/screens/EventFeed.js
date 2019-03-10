import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../config';
import { Card, Button, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

class EventFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            events: null
        }
        this.database = firebase.database();
    }

    componentDidMount() {
        // firebase.initializeApp(firebaseConfig);
        this.database.ref('/events').once('value')
            .then(snapshot => {
                console.log(snapshot.val());
                this.setState({isLoading: false, events:snapshot.val()});
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

    renderEventCards() {
        const { events } = this.state;
        const eventIds = Object.keys(events);
        const eventDetails = Object.values(events);

        return eventDetails.map((event, index) => {
            return (
                <Card title={event.eventTitle} key={eventIds[index]}>
                    <Text>{event.eventDescription}</Text>
                </Card>
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
            <View style={{backgroundColor: 'white', flex:1}}>
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
                    {this.renderEventCards()}
                </ScrollView>
            </View>
        )
    }
}

export default EventFeed