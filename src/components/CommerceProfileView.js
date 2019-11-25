import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import {
  Avatar,
  Text,
  Divider,
  Image,
  Button,
  Rating
} from 'react-native-elements';
import { PictureView } from './common';
import { connect } from 'react-redux';
import {
  onCommerceReadProfile,
  registerFavoriteCommerce,
  deleteFavoriteCommerce,
  onScheduleRead,
  commerceHitsUpdate,
  onLocationChange
} from '../actions';
import { MAIN_COLOR } from '../constants';
import CommerceCourtTypes from './client/CommerceCourtTypes';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const imageSizeWidth = Math.round(Dimensions.get('window').width);
const imageSizeHeight = Math.round(Dimensions.get('window').height * 0.2);
const avatarSize = Math.round(Dimensions.get('window').width * 0.4);

class CommerceProfileView extends Component {
  state = {
    favorite: false,
    pictureVisible: false
  };

  componentDidMount() {
    if (this.props.navigation.state.routeName === 'commerceProfileView') {
      this.setState({
        favorite: this.props.favoriteCommerces.includes(
          this.props.commerce.objectID
        )
      });
      this.props.onCommerceReadProfile(this.props.commerce.objectID);
    } else {
      this.setState({
        favorite: this.props.favoriteCommerces.includes(this.props.commerceId)
      });
      this.props.onCommerceReadProfile(this.props.commerceId);
    }

    this.props.commerceHitsUpdate([]);
  }

  renderDescription = () => {
    if (this.props.description)
      return (
        <View style={styles.descriptionStyle}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>
            {this.props.description}
          </Text>
        </View>
      );
  };

  renderLocation = () => {
    const { address, city } = this.props;
    const { provinceId, name } = this.props.province;

    if (address || city || provinceId) {
      const { locationContainerStyle } = styles;

      return (
        <TouchableOpacity
          onPress={() => this.onMapPress()}
          style={locationContainerStyle}
        >
          <Ionicons name="md-pin" type="ionicon" size={16} />

          <Text
            style={{ textAlign: 'center', paddingLeft: 5 }}
          >{`${address}, ${city}, ${name}`}</Text>
        </TouchableOpacity>
      );
    }
  };

  onFavoritePress = commerceId => {
    if (this.state.favorite) {
      this.props.deleteFavoriteCommerce(commerceId);
    } else {
      this.props.registerFavoriteCommerce(commerceId);
    }
    this.setState({ favorite: !this.state.favorite });
  };

  onMapPress = () => {
    const { address, city, province, latitude, longitude } = this.props;
    this.props.onLocationChange({
      address,
      city,
      provinceName: province.name,
      latitude,
      longitude
    });

    this.props.navigation.navigate('showMyAddressMap');
  };

  onPicturePress = () => {
    this.setState({ pictureVisible: !this.state.pictureVisible });
  };

  getRatingValue = () => {
    const { total, count } = this.props.rating;
    return total ? total / count : 0;
  };

  render() {
    const { headerContainerStyle, avatarContainerStyle, avatarStyle } = styles;

    const {
      profilePicture,
      headerPicture,
      name,
      commerceId,
      navigation,
      rating
    } = this.props;

    return (
      <ScrollView>
        <View>
          <Image
            style={{
              height: imageSizeHeight,
              width: imageSizeWidth,
              position: 'absolute'
            }}
            source={profilePicture ? { uri: headerPicture } : null}
          />

          <View style={{ flexDirection: 'row-reverse' }}>
            <Button
              type="clear"
              icon={
                <Ionicons
                  name="md-information-circle-outline"
                  color={'white'}
                  size={30}
                />
              }
              onPress={() => navigation.navigate('commerceProfileInfo')}
            />

            <Button
              type="clear"
              icon={
                this.state.favorite ? (
                  <Icon name="favorite" color={'red'} size={30} />
                ) : (
                    <Icon name="favorite-border" color={'white'} size={30} />
                  )
              }
              onPress={() => this.onFavoritePress(commerceId)}
            />

            <Button
              type="clear"
              icon={
                <Ionicons name="md-text" color={'white'} size={30} />
              }
              onPress={() =>
                this.props.navigation.navigate(
                  'commerceReviewsList',
                  { commerceId: this.props.commerceId }
                )
              }
            />
          </View>

          <View style={headerContainerStyle}>
            <View style={avatarContainerStyle}>
              <Avatar
                rounded
                source={profilePicture ? { uri: profilePicture } : null}
                size={avatarSize}
                icon={{ name: 'store' }}
                containerStyle={avatarStyle}
                onPress={() => this.onPicturePress()}
              />
            </View>

            <Text h4>{name}</Text>

            <Rating
              style={{ padding: 8 }}
              readonly
              imageSize={22}
              startingValue={this.getRatingValue()}
            />

            {this.renderLocation()}
          </View>

          <View>{this.renderDescription()}</View>
          <Divider
            style={{
              backgroundColor: 'grey',
              marginTop: 10,
              margin: 5,
              marginLeft: 15,
              marginRight: 15
            }}
          />
        </View>
        <CommerceCourtTypes navigation={navigation} />
        <PictureView
          isVisible={this.state.pictureVisible}
          onClosePress={this.onPicturePress}
          picture={this.props.profilePicture}
          width={imageSizeWidth}
          height={(imageSizeHeight / 0.2) * 0.5}
        />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignSelf: 'stretch'
  },
  headerContainerStyle: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: imageSizeHeight / 2 - 49
  },
  avatarContainerStyle: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  avatarStyle: {
    borderWidth: 4,
    borderColor: MAIN_COLOR,
    marginBottom: 10
  },
  locationContainerStyle: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10,
    marginLeft: 15,
    marginRight: 15
  },
  descriptionStyle: {
    alignItems: 'center',
    marginHorizontal: 15
  }
});

const mapStateToProps = state => {
  const { commerce } = state.courtReservation;
  const { favoriteCommerces } = state.commercesList;

  const {
    name,
    description,
    address,
    city,
    province,
    profilePicture,
    headerPicture,
    commerceId,
    latitude,
    longitude,
    rating
  } = state.commerceData;
  const { cards } = state.commerceSchedule;

  return {
    name,
    description,
    address,
    city,
    province,
    profilePicture,
    headerPicture,
    commerceId,
    latitude,
    longitude,
    rating,
    commerce,
    favoriteCommerces,
    cards
  };
};

export default connect(mapStateToProps, {
  onCommerceReadProfile,
  registerFavoriteCommerce,
  deleteFavoriteCommerce,
  onScheduleRead,
  commerceHitsUpdate,
  onLocationChange
})(CommerceProfileView);
