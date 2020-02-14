import { SET_FETCH, UNSET_FETCH } from '../types';
import * as R from 'ramda';

export const fetchs = (state = [], { type, payload }) => {
  switch (type) {
    case SET_FETCH:
      return [...state, payload];
    case UNSET_FETCH:
      return R.filter(R.equals(payload), state);
    default:
      return state;
  }
};
