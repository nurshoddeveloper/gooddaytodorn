import {
  EVENT_LOAD_PENDING,
  EVENT_LOAD_FULFILLED,
  EVENT_LOAD_REJECTED,
} from '../constants';

const initialState = {
  event: null,
  isFetching: false,
  error: false,
  errorObj: null
};

export default function eventReducer(state = initialState, action) {
  switch (action.type) {
    case EVENT_LOAD_PENDING:
      console.log('eventReducer', action.type);
      return {
        ...initialState,
        isFetching: true
      };
    case EVENT_LOAD_FULFILLED:
      console.log('eventReducer', action.type);
      return {
        ...state,
        isFetching: false,
        event: action.payload
      };
    case EVENT_LOAD_REJECTED:
      console.log('eventReducer', action.type);
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
