// action types
export const FETCH_ROOM_CODE = 'room/FETCH_ROOM_CODE';
export const FETCH_ROOM_CODE_SUCCESS = 'room/FETCH_ROOM_CODE_SUCCESS';
export const FETCH_ROOM_CODE_FAILURE = 'room/FETCH_ROOM_CODE_FAILURE';

export const CONNECT_ROOM = 'room/CONNECT_ROOM';
export const CONNECT_ROOM_SUCCESS = 'room/CONNECT_ROOM_SUCCESS';
export const CONNECT_ROOM_FAILURE = 'room/CONNECT_ROOM_FAILURE';

export const CHECK_ROOM_CODE = 'room/CHECK_ROOM_CODE';
export const CHECK_ROOM_CODE_SUCCESS = 'room/CHECK_ROOM_CODE_SUCCESS';
export const CHECK_ROOM_CODE_FAILURE = 'room/CHECK_ROOM_CODE_FAILURE';

export const SET_NAME = 'room/SET_NAME';
export const SET_CODE = 'room/SET_CODE';

export const SET_ROUND = 'room/SET_ROUND';
export const SET_TIME_LIMIT = 'room/SET_TIME_LIMIT';
export const SET_MEMBER_LIST = 'room/SET_MEMBER_LIST';

export const IMAGE_READY = 'room/IMAGE_READY';
export const IMAGE_READY_SUCCESS = 'room/IMAGE_READY_SUCCESS';
export const IMAGE_READY_FAILURE = 'room/IMAGE_READY_FAILURE';


// action
export const fetchRoomCode = (name) => ({
  type: FETCH_ROOM_CODE,
  payload: {
    name: name,
  },
});

export const fetchRoomCodeSuccess = (response) => ({
  type: FETCH_ROOM_CODE_SUCCESS,
  payload: response,
});

export const fetchRoomCodeFailure = (response) => ({
  type: FETCH_ROOM_CODE_FAILURE,
  payload: response,
});

export const connectRoom = (name, code) => ({
  type: CONNECT_ROOM,
  payload: {
    name,
    code,
  },
});

export const connectRoomSuccess = (response) => ({
  type: CONNECT_ROOM_SUCCESS,
  payload: response,
});

export const connectRoomFailure = (response) => ({
  type: CONNECT_ROOM_FAILURE,
  payload: response,
});

export const setName = (name) => ({
  type: SET_NAME,
  payload: name,
});

export const setCode = (code) => ({
  type: SET_CODE,
  payload: code,
});

export const checkRoomCode = (code) => ({
  type: CHECK_ROOM_CODE,
  payload: code,
});

export const setRound = (round) => ({
  type: SET_ROUND,
  payload: round,
});

export const setTimeLimit = (time) => ({
  type: SET_TIME_LIMIT,
  payload: time,
});

export const setMemberList = (list) => ({
  type: SET_MEMBER_LIST,
  payload: list,
});

export const imageReady = (code) => ({
  type: IMAGE_READY,
  payload: code,
});

export const imageReadySuccess = (response) => ({
  type: IMAGE_READY_SUCCESS,
  payload: response,
});

export const imageReadyFailure = (response) => ({
  type: IMAGE_READY_FAILURE,
  payload: response,
});


const initialState = {
  code: '',
  name: '',
  round: 2,
  timeLimit: 3,
  connected: false,
  memberList: [],
  images: [],
}

// reducer
function room(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ROOM_CODE:
      return {
        ...state,
      };

    case FETCH_ROOM_CODE_SUCCESS: 
      return {
        ...state,
        name: payload.name,
        code: payload.data.roomCode,
        connected: true,
      };

    case FETCH_ROOM_CODE_FAILURE:
      return {
        ...state,
        ...payload.response.data,
        code: '',
        name: '',
        showError: true,
        connected: false,
      };

    case CONNECT_ROOM:
      return {
        ...state,
      };
    
    case CONNECT_ROOM_SUCCESS:
      return {
        ...state,
        ...payload,
        connected: true,
        code: payload.code,
      };

    case CONNECT_ROOM_FAILURE:
      return {
        ...state,
        ...payload,
        errorMsg: payload.response.data.message,
        connected: false,
        showError: true,
      };

    case SET_NAME:
      return {
        ...state,
        name: payload.name,
      };
    
    case SET_CODE:
      return {
        ...state,
        code: payload.code,
      };

    case CHECK_ROOM_CODE:
      return {
        ...state,
      };

    case CHECK_ROOM_CODE_SUCCESS:
      return {
        ...state,
        ...payload,
        code: payload.code,
      };

    case CHECK_ROOM_CODE_FAILURE:
      return {
        ...state,
        ...payload,
        errorMsg: payload.response.data.message,
        connected: false,
        showError: true,
      };

    case SET_ROUND:
      return {
        ...state,
        round: payload,
      };
    
    case SET_TIME_LIMIT:
      return {
        ...state,
        timeLimit: payload,
      };

    case SET_MEMBER_LIST:
      return {
        ...state,
        memberList: payload,
      }

    case IMAGE_READY:
      return {
        ...state,
      }

    case IMAGE_READY_SUCCESS:
      return {
        ...state,
        images: payload,
      }
    
    case IMAGE_READY_FAILURE:
      return {
        ...state,
        images: [],
        showError: true,
      }

    default:
      return state;
  }
}

export default room;