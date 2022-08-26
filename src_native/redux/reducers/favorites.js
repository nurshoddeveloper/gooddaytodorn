import {
  FAVORITES_LOAD_PENDING,
  FAVORITES_LOAD_FULFILLED,
  FAVORITES_LOAD_REJECTED,
} from '../constants';

const initialState = {
  tasks: [],
  projects: [],
  isFetching: false,
  error: false
};

export default function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case FAVORITES_LOAD_PENDING:
      console.log('favoritesReducer', action.type);
      return {
        ...initialState,
        isFetching: true
      };
    case FAVORITES_LOAD_FULFILLED:
      console.log('favoritesReducer', action.type);
      return {
        ...state,
        isFetching: false,
        tasks: action.payload.tasks || [],
        projects: action.payload.projects || [],
      };
    case FAVORITES_LOAD_REJECTED:
      console.log('favoritesReducer', action.type);
      return {
        ...state,
        isFetching: false,
        error: true
      };

    default:
      return state;
  }
}