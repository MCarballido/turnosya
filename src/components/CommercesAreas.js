import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { FlatList, View, Text, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Spinner } from './common';
import { commercesRead, areasRead } from '../actions';
import { MAIN_COLOR } from '../constants';
import CommercesAreaItem from './CommercesAreaItem';

class CommercesAreas extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentWillMount() {
    this.props.areasRead();
    this.props.navigation.setParams({
      rightIcon: this.renderRightIcon()
    });
  }
  renderRightIcon = () => {
    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate('commercesList')}
        underlayColor="transparent"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: 'white',
              marginRight: 5,
              textAlign: 'center',
              alignSelf: 'center',
              // fontWeight: 'bold',
              paddingRight: 2
            }}
          >
            Ver todos
          </Text>
          <Ionicons
            name="md-arrow-round-forward"
            size={24}
            color="white"
            style={{ marginRight: 15 }}
          />
        </View>
      </TouchableHighlight>
    );
  };

  renderRow = ({ item }) => {
    return <CommercesAreaItem area={item} navigation={this.props.navigation} />;
  };

  render() {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.areas}
          renderItem={this.renderRow}
          keyExtractor={area => area.id}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { areas, loading } = state.commercesList;
  return { areas, loading };
};

export default connect(
  mapStateToProps,
  { areasRead }
)(CommercesAreas);
