import React, { Component } from 'react';
import { Alert, Dimensions, Platform, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../config';
import { Button, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { Spinner } from 'native-base';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

import GlobalContext, { EventContext } from '../context/GlobalContext';

import CommentModal from '../../src/Modal/CommentModal';

class EventFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            user: null,
            events: null,
            filter: null,
            eventRemoved: null,
            isModalVisible: false,
            commentId: -1
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

    refreshEvents(eArg) {
        var windowHeight = Dimensions.get('window').height,
          height = eArg.nativeEvent.contentSize.height,
          offset = eArg.nativeEvent.contentOffset.y;

        if( windowHeight + offset >= height ){
            //Alert.alert("Bottom reached");
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
        }

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

    commentOnEvent() {

    }

    joinEvent(eventId) {
        const myUserId = firebase.auth().currentUser.uid;

         firebase.database().ref('/users/' + myUserId + '/currentEvents').push().set(eventId, error => {	
            setTimeout(() => {	
              this.props.navigation.navigate('EventFeed');	
            }, 1000);	
          });
          Alert.alert("You have joined this event")
    }

    renderEventCards(value) {
        const { events } = this.state;
        const eventIds = Object.keys(events);
        const eventDetails = Object.values(events);
        const eventIcons =
        {
            sports: require("../images/Sports.png"),
            party: require("../images/Party.png"),
            food: require("../images/Food.png"),
        }
        var selectedIcon;

        return eventDetails.map((event, index) => {

            switch (event.eventCategory)
            {
                case 'Sports': selectedIcon = eventIcons.sports; break;
                case 'Party': selectedIcon = eventIcons.party; break;
                case 'Food': selectedIcon = eventIcons.food; break;
                default: selectedIcon = eventIcons.food; break;
            }

            return (
                <TouchableHighlight
                    onPress={() => { this.goSeeEventDetail(eventIds[index], value) }}
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
                                onPress={() => this.setState({isModalVisible: true, commentId: eventIds[index]})}
                                title="Comment"
                                color="orange"
                            />
                            <CardButton
                                onPress={() => {this.joinEvent(eventIds[index])}}
                                title="Join"
                                color="orange"
                            />
                        </CardAction>
                    </Card>
                </TouchableHighlight>
            );
        });
    }

    renderFilteredEvents(value) {
        const { events } = this.state;
        const eventIds = Object.keys(events);
        const eventDetails = Object.values(events);
        const eventIcons =
        {
            sports: require("../images/Sports.png"),
            party: require("../images/Party.png"),
            food: require("../images/Food.png"),
        }
        var selectedIcon;

        let withCategory = eventDetails.filter((event) => {
            return event.eventCategory === this.state.filter;
        });

        let withoutCategory  = eventDetails.filter((event) => {
            return event.eventCategory !== this.state.filter;
        });

        let filteredEvents = [...withCategory, ...withoutCategory];

        return filteredEvents.map((event, index) => {

            switch (event.eventCategory)
            {
                case 'Sports': selectedIcon = eventIcons.sports; break;
                case 'Party': selectedIcon = eventIcons.party; break;
                case 'Food': selectedIcon = eventIcons.food; break;
                default: selectedIcon = eventIcons.food; break;
            }

            return (

                <TouchableHighlight
                    onPress={() => { this.goSeeEventDetail(eventIds[index], value) }}
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
                                onPress={() => this.setState({isModalVisible: true, commentId: eventIds[index]})}
                                title="Comment"
                                color="orange"
                            />
                            <CardButton
                                onPress={() => {this.joinEvent(eventIds[index])}}
                                title="Join"
                                color="orange"
                            />
                        </CardAction>
                    </Card>
                </TouchableHighlight>
            );
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

    setUserSelectedEvent() {

    }

    render() {

        console.log(this.state.isModalVisible);
        if(this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <View style={{backgroundColor: '#ECF2F6', flex:1}}>
                <EventContext.Consumer>
                    {(value) => {
                        return (
                            <React.Fragment>
                                <Header
                                    centerComponent={{ text: 'Home', style: { color: '#fff' } }}
                                    rightComponent={<Icon name="plus" 
                                    type='font-awesome' 
                                    onPress={() => this.goToCreateEventScreen()}
                                    color="#fff"
                                />}
                                containerStyle={{ backgroundColor: '#1e9e88' }}
                                />
                                <ScrollView
                                     onScroll={(eArg) => this.refreshEvents(eArg)}>
                                    {this.state.filter && this.state.filter !== 'None' ? this.renderFilteredEvents(value) : this.renderEventCards(value)}
                                </ScrollView>
                                <CommentModal 
                                    isVisible={this.state.isModalVisible}
                                    closeModal={() => this.setState({isModalVisible: false})}
                                    commentId={this.state.commentId}
                                />
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
