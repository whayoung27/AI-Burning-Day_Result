import { SET_USER, UNSET_USER } from '../types';

export const user = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return payload;
    case UNSET_USER:
      return {};
    default:
      return state;
  }
};
