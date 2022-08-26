import {
  ROOT_SCREEN_CHANGE
} from '../constants';

export function rootScreenChange(screen) {
  return dispatch => {
    dispatch({
      type: ROOT_SCREEN_CHANGE,
      screen
    });
  };
}
