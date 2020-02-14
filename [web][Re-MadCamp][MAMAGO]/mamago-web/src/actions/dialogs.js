import Axios from 'axios';
import store from '../store';
import * as R from 'ramda';
import Cookies from 'js-cookie';
import {
  SET_DIALOGS,
  CLEAR_DIALOGS,
  FETCH_DIALOGS,
  UPDATE_DIALOG,
  SET_DIALOG,
  SET_FETCH,
  UNSET_FETCH,
  ADD_ERROR,
  CREATE_DIALOG
} from '../types';

import { API_ADDR } from '../common';

export const fetchUserDialogs = () => {
  const access_token = Cookies.get('access_token');
  const url = API_ADDR + '/api/dialogs';
  store.dispatch({
    type: SET_FETCH,
    payload: FETCH_DIALOGS
  });
  return dispatch =>
    Axios.get(url, { headers: { 'access-token': access_token } })
      .then(res => {
        const dialogs = res.data.data;
        dispatch({
          type: SET_DIALOGS,
          payload: dialogs
        });
        const notCompleteDialogs = R.filter(d => !d.complete, dialogs);
        if (!R.isEmpty(notCompleteDialogs)) {
          dispatch({
            type: SET_DIALOG,
            payload: notCompleteDialogs[0]
          });
        } else {
          dispatch(createDialog({ source: 'ko', target: 'en' }));
        }
        dispatch({
          type: UNSET_FETCH,
          payload: FETCH_DIALOGS
        });
      })
      .catch(e => {
        const message = e.message;
        dispatch({
          type: ADD_ERROR,
          payload: message
        });
        dispatch({
          type: UNSET_FETCH,
          payload: FETCH_DIALOGS
        });
      });
};
export const createDialog = ({ target, source }) => {
  const access_token = Cookies.get('access_token');
  const url = API_ADDR + '/api/dialogs';
  store.dispatch({
    type: SET_FETCH,
    payload: CREATE_DIALOG
  });
  return dispatch =>
    Axios.post(
      url,
      {
        target: 'en',
        source: 'ko'
      },
      { headers: { 'access-token': access_token } }
    )
      .then(res => {
        const dialog = res.data.data;
        dispatch({
          type: SET_DIALOG,
          payload: dialog
        });
        dispatch({
          type: UNSET_FETCH,
          payload: CREATE_DIALOG
        });
      })
      .catch(e => {
        const message = e.message;
        dispatch({
          type: ADD_ERROR,
          payload: message
        });
        dispatch({
          type: UNSET_FETCH,
          payload: CREATE_DIALOG
        });
      });
};
export const updateDialog = ({
  id,
  original,
  feedback,
  user_intention,
  complete,
  afterSuccess
}) => {
  const access_token = Cookies.get('access_token');
  const url = API_ADDR + `/api/dialogs/${id}`;
  store.dispatch({
    type: SET_FETCH,
    payload: UPDATE_DIALOG
  });
  const update_params = clean({ original, feedback, user_intention, complete });

  return dispatch =>
    Axios.put(url, update_params, {
      headers: {
        'access-token': access_token,
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(res => {
        const dialog = res.data.data;
        dispatch({
          type: SET_DIALOG,
          payload: dialog
        });
        dispatch({
          type: UNSET_FETCH,
          payload: UPDATE_DIALOG
        });
        if (typeof afterSuccess === 'function') afterSuccess();
      })
      .catch(e => {
        const message = e.message;
        dispatch({
          type: ADD_ERROR,
          payload: message
        });
        dispatch({
          type: UNSET_FETCH,
          payload: UPDATE_DIALOG
        });
      });
};

function clean(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}
