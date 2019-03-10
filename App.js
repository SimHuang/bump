/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createSwitchNavigator, 
        createStackNavigator, 
        createBottomTabNavigator, 
        createAppContainer } from "react-navigation";
// import { provider } from 'react-redux';
// import { createStore } from 'redux';

import firebase from '@firebase/app';
import { firebaseConfig } from './config';

// import reducers from './src/reducer/index';

import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import EventDetail from './src/screens/EventDetail';
import EventFeed from './src/screens/EventFeed';
import UserEvents from './src/screens/UserEvents';
import History from './src/screens/History';
import UserProfile from './src/screens/UserProfile';
import Setting from './src/screens/Setting';
import CreateEvent from './src/screens/CreateEvent';

// const store = createStore(reducers); 

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// createStackNavigator returns a component 
// we have to store all our screens here that requires navagivation
// const AppNavigator = createStackNavigator({
//   // Login: Login,
//   // Signup: Signup,
//   EventFeed: EventFeed,
//   EventDetail: EventDetail,
// });

const AppNavigator = createBottomTabNavigator({
  EventFeed: {
    screen: EventFeed, 
    tabBarOptions: {
      showLabel: false
    },
    navigationOptions: {
      title: 'Home'
    }
  },
  UserEvents: {
    screen: UserEvents,
    navigationOptions: {
      title: 'Events'
    }
  },
  History,
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      title: 'Profile'
    }
  },
  Setting
});

const SignupNavigator = createStackNavigator({
  Signup: Signup
});

const LoginNavigator = createStackNavigator({
  Login: Login
});

const Main = createAppContainer(createSwitchNavigator(
  {AppNavigator, SignupNavigator, LoginNavigator, CreateEvent}, 
  {initialRouteName: 'LoginNavigator'})
);

type Props = {};
class App extends Component<Props> {
  componentDidMount() {    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  
  render() {
    return (
      <Main />
    );
  }
}

export default App

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
