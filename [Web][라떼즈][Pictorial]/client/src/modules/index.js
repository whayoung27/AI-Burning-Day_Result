import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import room from './room';
import imageUpload from './imageUpload';

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  room,
  imageUpload,
});

export default rootReducer;