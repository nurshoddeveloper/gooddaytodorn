import {
  SEARCH_PENDING,
  SEARCH_FULFILLED,
  SEARCH_REJECTED,
  SEARCH_CLEAR,
} from '../constants';

const initialState = {
  query: '',
  result: [],
  isFetching: false,
  error: false
};

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_PENDING:
      console.log('searchReducer', action.type);
      return {
        ...initialState,
        isFetching: true
      };
    case SEARCH_FULFILLED:
      console.log('searchReducer', action.type);
      return {
        ...state,
        isFetching: false,
        result: action.payload.result,
        query: action.payload.query
      };
    case SEARCH_REJECTED:
      console.log('searchReducer', action.type);
      return {
        ...state,
        isFetching: false,
        error: true
      };
    case SEARCH_CLEAR:
      return {
        ...initialState
      };

    default:
      return state;
  }
}