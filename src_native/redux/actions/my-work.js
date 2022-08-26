import {
  MY_WORK_LOAD,
  MY_WORK_CHANGE,
  MY_WORK_RESET
} from '../constants';
import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';


export function myWorkLoad() {
  console.log('myWorkLoad');
  return {
    type: MY_WORK_LOAD,
    //payload: apiCall(this, 'get', 'session')
    payload: new Promise((resolve, reject) => {
      apiCall(this, 'get', 'session')
        .then(() => {
          gd.presence.init();
          resolve();
        })
        //.catch(reject)
        .catch(e => {
          if (e.code == 403) {
            window.sentryLogger.captureMessageInfo(window.nativeAppAuthInfoMessage);
          } else {
            window.sentryLogger.captureException(e);
          }
          reject(e);
        })
    })
  }
}


export function myWorkChange() {
  return dispatch => {

    const items = gd.session.myWork.exportMobile();
    const totals =  {
      inbox: items.inbox,
      pastdue: items.pastdue,
      today: items.today,
      tomorrow: items.tomorrow,
      someday: items.someday,
      scheduled: items.scheduled
    };

    dispatch({
      type: MY_WORK_CHANGE,
      totals
    });
  };
}

export function myWorkReset() {
  return dispatch => {
    dispatch({
      type: MY_WORK_RESET
    });
  };
}