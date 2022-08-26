import {
  ME_CHANGE,
  ME_RESET
} from '../constants';

const initialState = {
  id: null,
  name: null,
  icon: null,
  timezone: null,
  email: null
};

export default function meReducer(state = initialState, action) {
  switch (action.type) {
    case ME_CHANGE:
      console.log('meReducer', action.type, action.data);
      return {
        ...state,
        ...action.data
      };
    case ME_RESET:
      console.log('meReducer', action.type);
      return initialState;
    default:
      return state;
  }
}