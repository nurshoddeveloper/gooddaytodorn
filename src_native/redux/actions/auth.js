import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';
import authCall from '../../../src_web/src_web_changed/core/gd/data/request-auth';
import { SubmissionError } from 'redux-form';
import { myWorkLoad } from './my-work';
import localStorage, { LS_USER_LAST_EMAIL, LS_USER_LOGGED_OUT, LS_SESSION_TOKEN } from '../../../src_web/src_web_changed/local-storage';
import { FULL_STATE_RESET } from '../constants';
import { fcmStart, fcmPause } from '../../firebase-cloud-messaging/fcm-start';


export function login(email, password) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      authCall(this, 'post', 'login', {email, password})
        .then(data => {
          //console.log('data', data);

          localStorage.setItem(LS_USER_LAST_EMAIL, email);
          window.nativeAppLastEmail = email;

          localStorage.deleteItem(LS_USER_LOGGED_OUT);
          window.nativeAppLoggedOut = false;

          dispatch(myWorkLoad())
            .then(() => {
              fcmStart();
            });
          resolve();
        })
        .catch(e => {
          fcmPause();
          if (e.code == 403) {
            reject(new SubmissionError({_error: 'Incorrect email or password'}));
          } else {
            reject(new SubmissionError({_error: 'Error #' + e.code}));
            window.sentryLogger.captureException(e);
          }
          /*default handler*/
          //console.error('action login()', e);
        });
    })

  }
}

export function loginGoogle(user) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      authCall(this, 'post', 'google/login-mobile', { googleUserInfo: user })
        .then(data => {
          const email = user?.email

          localStorage.setItem(LS_USER_LAST_EMAIL, email);
          window.nativeAppLastEmail = email;

          localStorage.deleteItem(LS_USER_LOGGED_OUT);
          window.nativeAppLoggedOut = false;

          dispatch(myWorkLoad())
            .then(() => {
              fcmStart();
            });
          resolve();
        })
        .catch(e => {
          fcmPause();
          if (e.code == 403) {
            reject(new SubmissionError({_error: 'Incorrect email or password'}));
          } else {
            reject(new SubmissionError({_error: 'Error #' + e.code}));
            window.sentryLogger.captureException(e);
          }
          /*default handler*/
          //console.error('action login()', e);
        });
    })

  }
}

export function logout() {
  return dispatch => {
    return apiCall(this, 'post', 'logout')
      .then(() => {

        window.nativeAppLoggedOut = true;
        localStorage.setItem(LS_USER_LOGGED_OUT, 1);

        window.nativeAppSessionToken = '';
        localStorage.deleteItem(LS_SESSION_TOKEN);

        fcmPause();
        gd.session.me.clear();
        gd.presence.stop();

        dispatch({ type: FULL_STATE_RESET });

        console.log('logout ended');
      })
      .catch(e => {
        /*default handler*/
        console.error('action logout() catch', e);
        window.sentryLogger.captureException(e);
      });
  }
}
