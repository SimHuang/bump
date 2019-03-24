import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import { Container, Content, Item, Input } from 'native-base';

import GlobalContext, { EventContext } from '../context/GlobalContext';

import firebase from '@firebase/app';

class EventDetail extends Component {

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
                            <Input
                                multiline = {true}
                                disabled placeholder={"Description: " + eventDetail.eventDescription}/>
                        </Item>
                        <Item disabled>
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
                                containerStyle={{backgroundColor: '#1e9e88'}}
                                centerComponent={{ text: 'Detail', style: { color: '#fff' } }}
                                rightComponent={<Icon name="times"
                                type="font-awesome"
                                onPress={() => this.props.navigation.navigate('AppNavigator')}/>}
                                />
                            {this.renderEventDetails(currentEvent)}
                        </React.Fragment>
                        );
                    }}
                </EventContext.Consumer>
            </View>
        )
    }
}

export default EventDetail