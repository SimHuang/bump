import React from 'react';
import {Text, View, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../config';

class CommentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.isVisible,
      text: ''
    }

    this.database = firebase.database();
  }

  addComment() {
    const newCommentKey = firebase.database().ref().child('posts').push().key;
    firebase.database().ref('/events/' + this.props.commentId + '/comments/' + newCommentKey).set({
      comment: this.state.text
    });
    this.setState({text: ''});
    this.props.closeModal();
  }

  render() {
    return (
      <Modal
        style={{
          justifyContent: 'center',
          borderRadius: 5,
          shadowRadius: 10,
          height: 300
        }}
        isVisible={this.props.isVisible}
      >
       <View style={{ 
          backgroundColor: '#fff',
          justifyContent: 'center',
          borderRadius: 5,
          height: 300}}>
          <TextInput
            style={{
              margin:20
            }}
            placeholder="Enter your comment here..."
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <Button
            onPress={() => this.addComment()}
            title="Add Comment"
            style={{
              marginLeft: 20,
              marginRight: 20
            }}
          />
          <Button
            onPress={() => this.props.closeModal()}
            title="Cancel"
            type="clear"
            style={{
              marginLeft: 20,
              marginRight: 20
            }}
          />
        </View>
      </Modal>
    );
  }
}

export default CommentModal;
