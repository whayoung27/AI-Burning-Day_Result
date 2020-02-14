import { ADD_ERROR, CLEAR_ERROR } from '../types';
import * as R from 'ramda';

export const errors = (state = [], { type, payload }) => {
  switch (type) {
    case ADD_ERROR:
      return [...state, payload];
    case CLEAR_ERROR:
      return [];
    default:
      return state;
  }
};
