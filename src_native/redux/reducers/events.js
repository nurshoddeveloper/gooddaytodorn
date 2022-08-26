import {
  EVENTS_LOAD_PENDING,
  EVENTS_LOAD_FULFILLED,
  EVENTS_LOAD_REJECTED,
} from '../constants';

const initialState = {
  events: null,
  isFetching: false,
  error: false,
  errorObj: null
};

export default function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case EVENTS_LOAD_PENDING:
      console.log('eventsReducer', action.type);
      return {
        ...initialState,
        isFetching: true
      };
    case EVENTS_LOAD_FULFILLED:
      console.log('eventsReducer', action.type);
      return {
        ...state,
        isFetching: false,
        events: action.payload
      };
    case EVENTS_LOAD_REJECTED:
      console.log('eventsReducer', action.type);
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
