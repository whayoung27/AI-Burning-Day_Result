import { takeLatest, all, call, put } from 'redux-saga/effects';
// import { eventChannel } from 'redux-saga';
import {
  FETCH_ROOM_CODE, FETCH_ROOM_CODE_SUCCESS, FETCH_ROOM_CODE_FAILURE, 
  CONNECT_ROOM, CONNECT_ROOM_SUCCESS, CONNECT_ROOM_FAILURE,
  CHECK_ROOM_CODE, CHECK_ROOM_CODE_SUCCESS, CHECK_ROOM_CODE_FAILURE,
  IMAGE_READY, IMAGE_READY_SUCCESS, IMAGE_READY_FAILURE
} from '../modules/room';
import { push } from 'connected-react-router';
import { createRoom, checkRoomCode, connectRoom, imageReady } from '../apis';
// import io from 'socket.io-client';

// function connect() {
//   const socket = io('http://pictorial.puterism.com/room');
//   return new Promise(resolve => {
//     socket.on('connect', () => {
//       resolve(socket);
//     });
//   });
// }

// function subscribe(socket) {
//   return eventChannel(emit => {
//     socket.on('message', ({ text }) => {
//       console.log(text);
//     });

//     return function unsubscribe() {
//       socket.off();
//     }
//   })
// }

// function* read(socket) {
//   const channel = yield call(subscribe, socket);
//   while (true) {
//     const action = yield take(channel);
//     yield put(action);
//   }
// }

// function* write(socket) {
//   while (true) {
//     const { payload } = yield take(`${sendMessage}`);
//     socket.emit('message', payload);
//   }
// }

// function* handleIO(socket) {
//   yield fork(read, socket);
//   // yield fork(write, socket);
// }

function* fetchRoomCodeSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    const response = yield call(createRoom, payload);
    yield put({ type: FETCH_ROOM_CODE_SUCCESS, payload: { ...response, ...payload }});
    yield put(push(`/room/${response.data.roomCode}`, { code: response.data.roomCode }));
    // yield take(CONNECT_ROOM, connectRoomSaga);
  } catch (error) {
    yield put({ type: FETCH_ROOM_CODE_FAILURE, payload: error });
  }
}

function* checkRoomCodeSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    const response = yield call(checkRoomCode, payload);
    yield put({ type: CHECK_ROOM_CODE_SUCCESS, payload: { ...response, ...payload }});
    // yield put(push(`/room/${payload.code}`, { code: payload.code }));
  } catch (error) {
    yield put({ type: CHECK_ROOM_CODE_FAILURE, payload: error });
    yield put(push(`/`));
  }
}

function* connectRoomSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    const response = yield call(connectRoom, payload);
    yield put({ type: CONNECT_ROOM_SUCCESS, payload: { ...response, ...payload }});
    yield put(push(`/room/${payload.code}`, { name: payload.name, code: payload.code }));
  } catch (error) {
    yield put({ type: CONNECT_ROOM_FAILURE, payload: { ...error }});
  }
}

function* imageReadySaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    const response = yield call(imageReady, payload);
    yield put({ type: IMAGE_READY_SUCCESS, payload: { ...response }});
  } catch (error) {
    yield put({ type: IMAGE_READY_FAILURE, payload: { ...error }});
  }
}

// function* connectRoomSaga(action) {
//   const { payload } = action;
//   if (!payload) return;

//   try {
//     // const socket = yield call(connect);
//     // const task = yield fork(handleIO, socket);
//     // socket.emit('join', payload.name, payload.code);

//     yield put({ type: CONNECT_ROOM_SUCCESS, payload: { ...payload }});
//     yield put(push(`/room/${payload.code}`, { name: payload.name, code: payload.code }));
//   } catch (error) {
//     yield put({ type: CONNECT_ROOM_FAILURE, payload: {  ...error }});
//   }
// }

// function* flow() {
//   while (true) {
//     try {
//       let { payload } = yield take(CONNECT_ROOM);
//       const socket = yield call(connect);
//       socket.emit('join', payload.name, payload.code);
//       const task = yield fork(handleIO, socket);
//       yield put({ type: CONNECT_ROOM_SUCCESS, payload: { ...payload }});
//     } catch (error) {
//       yield put({ type: CONNECT_ROOM_FAILURE, payload: {  ...error }});
//     }
//   }
// }

export default function* roomSaga() {
  yield all([
    takeLatest(FETCH_ROOM_CODE, fetchRoomCodeSaga),
    takeLatest(CONNECT_ROOM, connectRoomSaga),
    takeLatest(CHECK_ROOM_CODE, checkRoomCodeSaga),
    takeLatest(IMAGE_READY, imageReadySaga),
    // takeLatest(JOIN_ROOM_WITH_NAME_SAVE, joinRoomWithNameSaveSaga),
    // fork(flow),
  ])
}
