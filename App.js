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
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from 'firebase';

import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// createStackNavigator returns a component 
// we have to store all our screens here that requires navigation
const AppNavigator = createStackNavigator({
  Login: Login,
  Signup: Signup
});

type Props = {};
class App extends Component<Props> {
  componentDidMount() {    
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyC9N-zIxOLB4TERIQLkeWVQnv1gsbuEvsM",
      authDomain: "bump-d25e4.firebaseapp.com",
      databaseURL: "https://bump-d25e4.firebaseio.com",
      projectId: "bump-d25e4",
      storageBucket: "bump-d25e4.appspot.com",
      messagingSenderId: "362511106868"
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
      <AppNavigator/>
    );
  }
}

export default createAppContainer(AppNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
