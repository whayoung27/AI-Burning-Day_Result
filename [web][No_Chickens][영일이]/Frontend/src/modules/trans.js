// import { getReceipt } from "../api/transApi"
// import { createReducer } from "redux-actions";
// // 액션 타입
// const GET_TRANS = "trans/GET_TRANS";
// const GET_TRANS_SUCCESS = "trans/GET_TRANS_SUCCESS";
// const GET_TRANS_FAILURE = "trans/GET_TRANS_FAILURE";

// // 액션 객체 생성함수 선언

// export const getTrans = (file, fType, country) => dispatch => {
//   // 먼저, 요청이 시작했다는것을 알립니다
//   dispatch({ type: GET_TRANS });

//   // 요청을 시작합니다
//   // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
//   return getReceipt(file, fType, country).then(
//     (response) => {
//       // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
//       dispatch({
//         type: GET_TRANS_SUCCESS,
//         payload: response
//       })
//     }
//   ).catch(error => {
//     // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
//     dispatch({
//       type: GET_TRANS_FAILURE,
//       payload: error
//     });
//   })
// }

// const initialState = {
//   loading: {
//     GET_TRANS: false
//   },
//   error: false,
//   items: []
// }

// const trans = createReducer(initialState, {
//   [GET_TRANS]: state => {
//     return {
//       ...state,
//       loading: {
//         GET_TRANS: true
//       }
//     };
//   },
//   [GET_TRANS_SUCCESS]: (state, action) => {
//     return {
//       ...state,
//       loading: {
//         GET_TRANS: false
//       },
//       items: action.payload.data,
//     };
//   },
//   [GET_TRANS_FAILURE]: (state) => ({
//     ...state,
//     loading: {
//       GET_TRANS: false
//     }
//   })
// });
// export default trans;