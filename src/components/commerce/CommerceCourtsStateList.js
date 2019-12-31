import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Spinner, EmptyList } from '../common';
import {
  onReservationClientRead,
  onCourtReservationsListValueChange,
  isCourtDisabledOnSlot
} from '../../actions';
import CommerceCourtsStateListItem from './CommerceCourtsStateListItem';

class CommerceCourtsStateList extends Component {
  state = {
    selectedReservation: {},
    selectedCourt: {}
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title')
  });

  courtReservation = court => {
    const { reservations, slot } = this.props;

    return reservations.find(reservation => {
      return (
        reservation.startDate.toString() === slot.startDate.toString() &&
        reservation.courtId === court.id
      );
    });
  };

  onReservedCourtPress = async (court, courtReservation) => {
    // aca si la reserva ya esta tambien en la lista detallada, trae el cliente directamente desde ahi
    try {
      const res = this.props.detailedReservations.find(
        res => res.id === courtReservation.id
      );
      if (res) {
        this.props.onCourtReservationsListValueChange({
          prop: 'reservationClient',
          value: res.client
        });
      } else {
        await this.props.onReservationClientRead(courtReservation.clientId);
      }

      const reservation = {
        client: { ...this.props.reservationClient },
        court: { ...court },
        ...courtReservation
      };

      this.props.navigation.navigate('reservationDetails', {
        reservation
      });
    } catch { }
  };

  renderRow({ item }) {
    const courtReservation = this.courtReservation(item);

    return (
      <CommerceCourtsStateListItem
        court={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
        courtAvailable={!courtReservation}
        disabled={isCourtDisabledOnSlot(item, this.props.slot)}
        onPress={!courtReservation
          ? null
          : () => this.onReservedCourtPress(item, courtReservation)
        }
      />
    );
  }

  renderList = () => {
    if (this.props.courts.length > 0) {
      return (
        <FlatList
          data={this.props.courts}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={court => court.id}
          extraData={this.props.reservations}
        />
      );
    }

    return <EmptyList title="No hay ninguna cancha" />;
  };

  render() {
    if (this.props.loading) return <Spinner />;

    return this.renderList();
  }
}

const mapStateToProps = state => {
  const { courts } = state.courtsList;
  const { commerceId } = state.commerceData;
  const { slot } = state.courtReservation;
  const {
    loading,
    reservations,
    loadingClientData,
    detailedReservations,
    reservationClient
  } = state.courtReservationsList;

  return {
    courts,
    loading,
    commerceId,
    slot,
    reservations,
    detailedReservations,
    loadingClientData,
    reservationClient
  };
};

export default connect(mapStateToProps, {
  onReservationClientRead,
  onCourtReservationsListValueChange
})(CommerceCourtsStateList);
