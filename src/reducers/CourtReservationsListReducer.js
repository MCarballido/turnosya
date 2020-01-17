import {
  ON_COMMERCE_COURT_RESERVATIONS_READING,
  ON_COMMERCE_COURT_RESERVATIONS_READ,
  ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
  ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
  ON_COMMERCE_RESERVATION_CANCELING,
  ON_COMMERCE_RESERVATION_CANCELED,
  ON_COMMERCE_RESERVATION_CANCEL_FAIL
} from '../actions/types';
import { Toast } from '../components/common';

INITIAL_STATE = {
  reservations: [],
  detailedReservations: [],
  nextReservations: [],
  loading: false,
  cancelationReason: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_COMMERCE_COURT_RESERVATIONS_READING:
      return { ...state, loading: true };
    case ON_COMMERCE_COURT_RESERVATIONS_READ:
      return { ...state, ...action.payload, loading: false };
    case ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL:
      return { ...state, loading: false };
    case ON_COMMERCE_RESERVATION_CANCELING:
      return { ...state, loading: true };
    case ON_COMMERCE_RESERVATION_CANCELED:
      Toast.show({ text: 'El turno ha sido cancelado' });
      return { ...state, loading: false, cancelationReason: '' };
    case ON_COMMERCE_RESERVATION_CANCEL_FAIL:
      Toast.show({ text: 'Error al intentar cancelar el turno' });
      return { ...state, loading: false };
    default:
      return state;
  }
};
