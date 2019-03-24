import React, {Component} from 'react'
import {StyleSheet, Text, View, Animated, Image, Easing, ImageBackground} from 'react-native'
import firebase from '@firebase/app';
import '@firebase/auth';
import { firebaseConfig } from '../../config';

export default class Splash extends Component {
    
    constructor(props){
        super(props);
    }

    componentDidMount(){
        
        firebase.initializeApp(firebaseConfig)

        const {navigate} = this.props.navigation;
        
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                navigate('AppNavigator')
            }
            navigate('LoginNavigator')
        })

    }

    render(){

        return(
            <ImageBackground source={require('../../images/background2.png')} style={styles.image}>
                <View style = {styles.container}>
                    <Image source={require('../../images/logo.png')} style={styles.logo} />
                </View>
            </ImageBackground>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    logo: {
        alignItems: 'center',
        resizeMode: 'contain',
        width: 400,
        height: 200
    }

})