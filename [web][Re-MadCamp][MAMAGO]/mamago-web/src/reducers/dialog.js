import { SET_DIALOGS, UNSET_DIALOG, CLEAR_DIALOGS, SET_DIALOG } from '../types';

const example = {
  id: '123124125',
  question: 'Hello, How was your day?',
  // original: 'im so tired',
  translated: `I'm so tired`,
  comprehanded: '나는 피곤해',
  // user_intention: '피곤한 하루였어',
  user_intention_translated: 'it was so tired day'
};

export const dialogs = (state = [], { type, payload }) => {
  switch (type) {
    case SET_DIALOGS:
      return payload;
    case CLEAR_DIALOGS:
      return [];
    default:
      return state;
  }
};

export const dialog = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_DIALOG:
      return payload;
    case UNSET_DIALOG:
      return {};
    default:
      return state;
  }
};
