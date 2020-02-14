import * as R from 'ramda';
import { ADD_CHAT, ADD_CHATS, SET_CHATS, CLEAR_CHATS } from '../types';

export const chats = (state = [], action) => {
  switch (action.type) {
    case ADD_CHAT:
      return [...state, action.payload];
    case ADD_CHATS:
      return R.concat(state, action.payload);
    case SET_CHATS:
      return action.payload;
    case CLEAR_CHATS:
      return [];
    default:
      return state;
  }
};
