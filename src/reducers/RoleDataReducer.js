import { ON_ROLES_READ, ON_ROLE_ASSIGNED } from '../actions/types';

const INITIAL_STATE = {
  roles: [],
  role: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_ROLES_READ:
      return { ...state, roles: action.payload };
    case ON_ROLE_ASSIGNED:
      return { ...state, role: action.payload };
    default:
      return state;
  }
};
