import {
  ROOT_SCREEN_CHANGE,
  rootScreenValue
} from '../constants';

const initialState = {
  screen: rootScreenValue.my_work
};

export default function rootScreenReducer(state = initialState, action) {
  switch (action.type) {
    case ROOT_SCREEN_CHANGE:
      console.log('rootScreenReducer', action.type, action.screen);
      return {
        screen: action.screen
      };
    default:
      return state;
  }
}