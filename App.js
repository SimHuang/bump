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
import { Icon } from 'react-native-elements';
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
import Hosted from './src/screens/Hosted';
import UserProfile from './src/screens/UserProfile';
import Setting from './src/screens/Setting';
import CreateEvent from './src/screens/CreateEvent';
import EditEvent from './src/screens/EditEvent';
import GlobalContext from './src/context/GlobalContext';

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
      title: 'Home',
      tabBarIcon: <Icon type="ion-icon" color="#1e9e88" name="home"/>
    }
  },
  UserEvents: {
    screen: UserEvents,
    navigationOptions: {
      title: 'Joined',
      tabBarIcon: <Icon name="users" color="#1e9e88" type="font-awesome" size={20}/>
    }
  },
  Hosted : {
    screen: Hosted,
    navigationOptions: {
      title: 'Hosted',
      tabBarIcon: <Icon type="ion-icon" color="#1e9e88" name="create"/>
    }
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      title: 'Profile',
      tabBarIcon: <Icon type="ion-icon" color="#1e9e88" name="person"/>
    }
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      tabBarIcon: <Icon name="cog" color="#1e9e88" type="font-awesome" size={20}/>
    }
  }
},
{
  tabBarOptions: {
    showIcon: true,
    activeTintColor: "#1e9e88"
  }
});

const SignupNavigator = createStackNavigator({
  Signup: Signup
});

const LoginNavigator = createStackNavigator({
  Login: Login
});

const Main = createAppContainer(createSwitchNavigator(
  {AppNavigator, SignupNavigator, LoginNavigator, CreateEvent, EditEvent, EventDetail}, 
  {initialRouteName: 'LoginNavigator'})
);

type Props = {};
class App extends Component<Props> {
  componentDidMount() {    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    console.disableYellowBox = true;
  }

  
  render() {
    return (
      <GlobalContext>
        <Main />
      </GlobalContext>
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
