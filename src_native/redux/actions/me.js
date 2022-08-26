import { ME_CHANGE, ME_RESET } from '../constants'

export function meChange(data) {
  return dispatch => {
    dispatch({
      type: ME_CHANGE,
      data
    });
    window.sentryLogger.setUserContext(data);
    //window.sentryLogger.captureMessageInfo('got user');
  };
}

export function meReset() {
  return dispatch => {
    dispatch({
      type: ME_RESET
    });
    window.sentryLogger.setGuestContext();
  };
}