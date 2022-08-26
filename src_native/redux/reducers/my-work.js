import {
  MY_WORK_LOAD_PENDING,
  MY_WORK_LOAD_FULFILLED,
  MY_WORK_LOAD_REJECTED,
  MY_WORK_CHANGE,
  MY_WORK_RESET
} from '../constants';

const initialState = {
  totals: {
    inbox: [],
    pastdue: [],
    today: [],
    tomorrow: [],
    someday: [],
    scheduled: []
  },
  isFetching: false,
  error: false
};

export default function myWorkReducer(state = initialState, action) {
  switch (action.type) {
    case MY_WORK_LOAD_PENDING:
      console.log('myWorkReducer', action.type);
      return {
        ...initialState,
        isFetching: true
      };
    case MY_WORK_LOAD_FULFILLED:
      console.log('myWorkReducer', action.type);
      // do nothing, data precessed in gd.session events
      return state;
      /*return {
        ...state,
        isFetching: false,
        totals: action.payload
      };*/
    case MY_WORK_LOAD_REJECTED:
      console.log('myWorkReducer', action.type);
      return {
        ...state,
        isFetching: false,
        error: true
      };

    case MY_WORK_CHANGE:
      console.log('myWorkReducer', action.type);
      return {
        ...state,
        isFetching: false,  //first time this will finish load
        totals: action.totals
      };
    case MY_WORK_RESET:
      console.log('myWorkReducer', action.type);
      return initialState;

    default:
      return state;
  }
}