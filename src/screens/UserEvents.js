import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config';
import { Card, Button, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

class UserEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            events:null
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

    goSeeEventDetail() {
        // Go to event detail page
        console.log('go to event detail page')
        this.props.navigation.navigate('EventDetail');
    }

    renderEventCards() {
        const { events } = this.state;
        const eventIds = Object.keys(events);
        const eventDetails = Object.values(events);
        const eventIcons =
        {
            sports: require("../images/Sports.png"),
            party: require("../images/Party.png"),
            food: require("../images/Food.png"),
        }

        var testIcon;

        return eventDetails.map((event, index) => {

            switch (event.eventCategory)
            {
                case 'Sports': testIcon = eventIcons.sports; break;
                case 'Party': testIcon = eventIcons.party; break;
                case 'Food': testIcon = eventIcons.food; break;
                default: testIcon = eventIcons.food; break;
            }

            return (
                <TouchableWithoutFeedback
                    onPress={() => { this.goSeeEventDetail() }}
                >
                    <Card
                        image = {testIcon}
                        featuredTitle={event.eventTitle}
                        featuredTitleStyle={styles.shadowText}
                        containerStyle={[styles.border, styles.zeroPadding]}
                        wrapperStyle = {styles.zeroMargin}
                        imageWrapperStyle = {styles.zeroMargin}
                        key={eventIds[index]}>
                        <View>
                            <Text>{'-' + event.eventDescription}</Text>
                            <Text>{'-' + event.eventDescription}</Text>
                            <Text>{'-' + event.eventDescription}</Text>
                        </View>

                        <View style={[styles.container, styles.margin]}>
                            {/* <View style={styles.buttonContainer}>
                                <Button
                                    icon={<Icon name='check-circle' color='#ffffff' />}
                                    buttonStyle={styles.buttonStyle}
                                    title={'Status'}
                                />
                            </View> */}
                            <View style={styles.buttonContainer}>
                                <Button
                                    icon={<Icon name="remove-circle" color='#ffffff' />}
                                    buttonStyle={styles.buttonStyle}
                                    title={'Leave Event'}
                                />
                            </View>
                        </View>
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
            <View style={{backgroundColor: '#ECF2F6', flex:1}}>
                <Header
                    centerComponent={{ text: '', style: { color: 'fff' } }}
                    containerStyle={{ backgroundColor: '#001827' }}
                />
                <ScrollView contentContainerStyle = {styles.zeroMarginVert}>
                    {this.renderEventCards()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',

    },

    shadowText: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
    },

    zeroPadding: {
        padding: 0
    },

    margin: {
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

    buttonStyle: {
        borderRadius: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        backgroundColor: '#EA1A3A'

    }
});

export default UserEvents