import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { HeaderBackButton } from 'react-navigation-stack';
import Schedule from './Schedule';
import {
  onScheduleRead,
  onScheduleValueChange,
  onCourtReservationValueChange,
  onCommerceCourtTypeReservationsRead,
  onCommerceCourtsReadByType,
  onCommerceCourtTypesRead
} from '../actions';

class ClientCommerceSchedule extends Component {
  state = { selectedDate: moment() };

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: navigation.getParam('leftButton')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      leftButton: this.renderBackButton()
    });

    this.props.onScheduleRead(this.props.commerce.objectID);
    this.props.onCommerceCourtsReadByType({
      commerceId: this.props.commerce.objectID,
      courtType: this.props.courtType
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations) {
      this.reservationsOnSlots(this.props.slots);
    }
  }

  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor='white' />
  }

  onBackPress = () => {
    // hace lo mismo que haria si se volviera a montar la pantalla anterior
    this.props.navigation.goBack(null);

    this.props.onCommerceCourtTypesRead({
      commerceId: this.props.commerce.objectID,
      loadingType: 'loading'
    });
  }

  onDateChanged = date => {
    this.setState({ selectedDate: date });

    this.props.onCommerceCourtTypeReservationsRead({
      commerceId: this.props.commerce.objectID,
      selectedDate: date,
      courtType: this.props.courtType
    });
  }

  onSlotPress = slot => {
    this.props.onCourtReservationValueChange({
      prop: 'slot',
      value: slot
    });

    this.props.navigation.navigate('commerceCourtsList');
  };

  reservationsOnSlots = slots => {
    const { reservations, courts } = this.props;

    var slots = slots.map(slot => {
      var reserved = 0;
      var available = true;

      reservations.forEach(reservation => {
        if (slot.startDate.toString() === reservation.startDate.toString()) reserved++;
      });

      if (reserved >= courts.length) available = false;

      return {
        ...slot,
        free: (courts.length - reserved),
        total: courts.length,
        available,
        disabled: !available
      };
    })

    this.props.onScheduleValueChange({ prop: 'slots', value: slots });
  };

  render() {
    const {
      cards,
      reservationDayPeriod,
      reservationMinLength,
      loadingSchedule,
      loadingReservations,
      loadingCourts
    } = this.props;

    const { selectedDate } = this.state;

    return (
      <Schedule
        cards={cards}
        selectedDate={selectedDate}
        reservationMinLength={reservationMinLength}
        reservationDayPeriod={reservationDayPeriod}
        datesWhitelist={[{
          start: moment(),
          end: moment().add(reservationDayPeriod, 'days')
        }]}
        loading={(loadingSchedule || loadingReservations || loadingCourts)}
        onDateChanged={date => this.onDateChanged(date)}
        onRefresh={() => {
          this.props.onScheduleRead(this.props.commerce.objectID);
          this.props.onCommerceCourtsReadByType({
            commerceId: this.props.commerce.objectID,
            courtType: this.props.courtType
          });
        }}
        onSlotPress={slot => this.onSlotPress(slot)}
      />
    );
  }
}

const mapStateToProps = state => {
  const {
    cards,
    slots,
    reservationDayPeriod,
    reservationMinLength,
    refreshing
  } = state.commerceSchedule;
  const loadingSchedule = state.commerceSchedule.loading;
  const { commerce, courtType } = state.courtReservation;
  const { reservations } = state.courtReservationsList;
  const loadingReservations = state.courtReservationsList.loading;
  const { slot } = state.courtReservation;
  const { courts } = state.courtsList;
  const loadingCourts = state.courtsList.loading;

  return {
    commerce,
    cards,
    slots,
    reservationDayPeriod,
    reservationMinLength,
    refreshing,
    reservations,
    slot,
    courts,
    courtType,
    loadingSchedule,
    loadingReservations,
    loadingCourts
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleValueChange,
    onScheduleRead,
    onCourtReservationValueChange,
    onCommerceCourtTypeReservationsRead,
    onCommerceCourtsReadByType,
    onCommerceCourtTypesRead
  }
)(ClientCommerceSchedule);
