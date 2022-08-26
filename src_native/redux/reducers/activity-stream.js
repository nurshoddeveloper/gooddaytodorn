import {
  ACTIVITY_STREAM_LOAD_PENDING,
  ACTIVITY_STREAM_LOAD_FULFILLED,
  ACTIVITY_STREAM_LOAD_REJECTED,
} from '../constants';

const initialState = {
  activities: [],
  isFetching: false,
  error: false,
  errorObj: null
};

export default function activityStreamReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIVITY_STREAM_LOAD_PENDING:
      console.log('activityStreamReducer', action.type);
      return {
        ...initialState,
        isFetching: true
      };
    case ACTIVITY_STREAM_LOAD_FULFILLED:
      console.log('activityStreamReducer', action.type);
      return {
        ...state,
        isFetching: false,
        activities: action.payload
      };
    case ACTIVITY_STREAM_LOAD_REJECTED:
      console.log('activityStreamReducer', action.type);
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
