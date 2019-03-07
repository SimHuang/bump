import React from 'react';

import { View, Text } from 'react-native';
import { Header, Icon } from 'react-native-elements';

class CreateEvent extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: 'white', flex:1}}>
        <Header
          leftComponent={<Icon name="angle-left" 
                              type="font-awesome" 
                              onPress={() => this.props.navigation.navigate('AppNavigator')}/>}
          centerComponent={{ text: 'CreateEvent', style: { color: '#fff' } }}
        />
        <Text>CreateEvent</Text>
      </View>
    )
  }
}

export default CreateEvent
