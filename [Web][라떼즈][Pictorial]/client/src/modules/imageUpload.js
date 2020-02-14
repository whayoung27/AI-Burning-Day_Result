// action types
export const UPLOAD_IMAGE = 'imageUpload/UPLOAD_IMAGE';
export const UPLOAD_IMAGE_SUCCESS = 'imageUpload/UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_FAILURE = 'imageUpload/UPLOAD_IMAGE_FAILURE';

export const INIT_IMAGE = 'imageUpload/INIT_IMAGE';

// action
export const uploadImage = (name, code, image) => ({
  type: UPLOAD_IMAGE,
  payload: {
    name, code, image,
  },
});

export const uploadImageSuccess = (response) => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload: response,
});

export const uploadImageFailure = (response) => ({
  type: UPLOAD_IMAGE_FAILURE,
  payload: response,
});

export const initImage = () => ({
  type: INIT_IMAGE,
});

const initialState = {
  encodedImg: null,
  answer: null,
  status: 'ready',
  possibles: null,
}

// reducer
function imageUpload(state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_IMAGE:
      return {
        ...state,
        status: 'uploading',
      };

    case UPLOAD_IMAGE_SUCCESS: 
      return {
        ...state,
        ...payload.data,
        status: 'uploaded',
        message: '',
      };

    case UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        ...payload.response.data,
        status: 'ready',
        encodedImg: null,
        answer: null,
        possibles: null,
      };
    
    case INIT_IMAGE:
      return {
        ...state,
        status: 'ready',
        encodedImg: null,
        answer: null,
        possibles: null,
      }

    default:
      return state;
  }
}

export default imageUpload;