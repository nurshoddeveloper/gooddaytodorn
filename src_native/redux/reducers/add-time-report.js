import {
  ADD_TIME_REPORT,
  ADD_TIME_REPORT_FULFILLED,
  ADD_TIME_REPORT_REJECTED
  } from '../constants';
  
  const initialState = {
    time: null,
    isFetching: false,
    error: false,
    errorObj: null
  };
  
  export default function time_report_reducer(state = initialState, action) {
    switch (action.type) {
      case ADD_TIME_REPORT:
        console.log('time_report_reducer', action.type);
        return {
          ...initialState,
          isFetching: true
        };
      case ADD_TIME_REPORT_FULFILLED:
        console.log('time_report_reducer', action.type);
        return {
          ...state,
          isFetching: false,
          time: action.payload
        };
      case ADD_TIME_REPORT_REJECTED:
        console.log('time_report_reducer', action.type);
        return {
          ...state,
          isFetching: false,
          error: true,
          errorObj: action.payload
        };
      default:
        return state;
    }
  }
  