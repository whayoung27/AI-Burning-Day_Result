import Axios from 'axios';
import { SET_USER, ADD_ERROR, SET_FETCH, UNSET_FETCH, FETCH_USER, LOGIN_USER } from '../types';
import store from '../store';
import { API_ADDR } from '../common';
import Cookies from 'js-cookie';
export const fetchUser = () => {
  const access_token = Cookies.get('access_token');
  const url = API_ADDR + '';
  store.dispatch({
    type: SET_FETCH,
    payload: FETCH_USER
  });
  return dispatch =>
    Axios.get(url, { headers: { 'access-token': access_token } })
      .then(res => {
        const user = res.data.data;
        dispatch({
          type: SET_USER,
          payload: user
        });
        dispatch({
          type: UNSET_FETCH,
          payload: FETCH_USER
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
          payload: FETCH_USER
        });
      });
};

export const login = ({ email, password, afterSuccess }) => {
  const url = API_ADDR + '/api/users/login';
  store.dispatch({
    type: SET_FETCH,
    payload: LOGIN_USER
  });
  return dispatch =>
    Axios.post(url, { email: email, password: password })
      .then(res => {
        const user = res.data.data;
        Cookies.set('access_token', res.data.meta.access_token);
        dispatch({
          type: SET_USER,
          payload: user
        });
        dispatch({
          type: UNSET_FETCH,
          payload: LOGIN_USER
        });
        if (typeof afterSuccess === 'funtcion') afterSuccess();
      })
      .catch(e => {
        const message = e.message;
        dispatch({
          type: ADD_ERROR,
          payload: message
        });
        dispatch({
          type: UNSET_FETCH,
          payload: FETCH_USER
        });
      });
};

export const signup = ({ email, password, afterSuccess }) => {
  const url = API_ADDR + '/api/users';
  store.dispatch({
    type: SET_FETCH,
    payload: LOGIN_USER
  });
  return dispatch =>
    Axios.post(url, { email: email, password: password })
      .then(res => {
        const user = res.data.data;
        Cookies.set('access_token', res.data.meta.access_token);
        dispatch({
          type: SET_USER,
          payload: user
        });
        dispatch({
          type: UNSET_FETCH,
          payload: LOGIN_USER
        });
        if (typeof afterSuccess === 'funtcion') afterSuccess();
      })
      .catch(e => {
        const message = e.message;
        dispatch({
          type: ADD_ERROR,
          payload: message
        });
        dispatch({
          type: UNSET_FETCH,
          payload: FETCH_USER
        });
      });
};
