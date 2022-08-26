import { AppState, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// timer in background
// https://github.com/facebook/react-native/issues/12981
// /www/goodday2_mobile_app/src/core/gd-presence/presence.js:87:37 onConnect
// https://www.npmjs.com/package/react-native-background-timer
// console.ignoredYellowBox = ['Setting a timer'];

//console.reportErrorsAsExceptions = false;
//console.log('console', Object.getOwnPropertyNames(console));

import gdConfig from '../src_web/app/mobile/config';
import { meChange, meReset } from './redux/actions/me';
import { myWorkChange, myWorkReset } from './redux/actions/my-work';
import { loadTask, receiveTaskGdSession } from './redux/actions/task';
import { loadEvents } from './redux/actions/events';
import { myWorkLoad } from './redux/actions/my-work';
import { rootScreenChange } from './redux/actions/root-screen';
import
  localStorage,
  { LS_USER_LAST_EMAIL, LS_USER_LOGGED_OUT, LS_SESSION_TOKEN, LS_FCM_TOKEN, LS_USER_ALLOWED_NOTIFICATIONS }
from '../src_web/src_web_changed/local-storage';
import fcmController from './firebase-cloud-messaging/fcm-controller';
import { fcmStart, fcmPause } from './firebase-cloud-messaging/fcm-start';
import { rootScreenValue } from './redux/constants';


// disable font scaling
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;


/*
// turn off console
console = {
  error() {},
  info() {},
  log() {},
  warn() {},
  trace() {},
  debug() {},
  table() {},
  group() {},
  groupCollapsed() {},
  groupEnd() {},
  assert() {},
  reportErrorsAsExceptions: false,
  ignoredYellowBox: ['Setting a timer'],
  _errorOriginal: null
};
*/

export default function prepareGdEnvironment(reduxStore) {

  let nativeAppState = '';
  let nativeAppDate = new Date();

  window.nativeAppInternet = false;
  window.nativeAppLastEmail = '';
  window.nativeAppLoggedOut = false;
  window.nativeAppSessionToken = '';

  window.nativeAppFirstAuthErrorProcessed = false;
  window.nativeAppAuthInfoMessage = 'get_session, 403, user not authorized';
  window.nativeAppFirstAuthInfoProcessed = false;

  window.nativeAppUserAllowedNotifications = null;
  window.nativeAppFcmToken = null; // startup saved token

  const p1 = localStorage.getItem(LS_USER_LAST_EMAIL).then(value => {
    window.nativeAppLastEmail = value || '';
    console.log('nativeAppLastEmail', window.nativeAppLastEmail);
  });

  const p2 = localStorage.getItem(LS_USER_LOGGED_OUT).then(value => {
    window.nativeAppLoggedOut = value == 1;
    console.log('nativeAppLoggedOut', window.nativeAppLoggedOut);
  });

  const p3 = localStorage.getItem(LS_SESSION_TOKEN).then(value => {
    window.nativeAppSessionToken = value || '';
    console.log('nativeAppSessionToken', window.nativeAppSessionToken);
  });

  const p4 = localStorage.getItem(LS_FCM_TOKEN).then(value => {
    window.nativeAppFcmToken = value || '';
    console.log('nativeAppFcmToken', window.nativeAppFcmToken);
  });

  const p5 = localStorage.getItem(LS_USER_ALLOWED_NOTIFICATIONS).then(value => {
    let flag = true;
    if (value === 'not_allowed') flag = false;
    window.nativeAppUserAllowedNotifications = flag;
    console.log('nativeAppUserAllowedNotifications', window.nativeAppUserAllowedNotifications);
  });

  const actions = {
    meChange(data) {
      return reduxStore.dispatch(meChange(data));
    },
    meReset() {
      return reduxStore.dispatch(meReset());
    },
    myWorkChange() {
      return reduxStore.dispatch(myWorkChange());
    },
    myWorkReset() {
      return reduxStore.dispatch(myWorkReset());
    },
    receiveTaskGdSession(data) {
      return reduxStore.dispatch(receiveTaskGdSession(data));
    },
    loadEvents() {
      return reduxStore.dispatch(loadEvents());
    }
  };

  window.reduxActions = actions;

  window.gdConfig = gdConfig;

  const gd = require('../src_web/app/mobile/gd/gd');
  window.gd = gd;


  //console.log('gd.const.busEvents.tasksListNew', gd.const.busEvents.tasksListNew);
  gd.bus.subscribe(gd.const.busEvents.tasksListNew, this, actions.myWorkChange);
  gd.bus.subscribe(gd.const.busEvents.tasksListChange, this, actions.myWorkChange);
  gd.bus.subscribe(gd.const.busEvents.tasksListDelete, this, actions.myWorkChange);

  gd.bus.subscribe('event-new', this, actions.loadEvents);
  gd.bus.subscribe('event-change', this, actions.loadEvents);
  gd.bus.subscribe('event-delete', this, actions.loadEvents);

  gd.init();


  function handleAppStateChange(nextState) {
    console.log('current appState', nativeAppState);
    console.log('next appState', nextState);

    if (nextState == 'active' && (nativeAppState == 'inactive' || nativeAppState == 'background')) {
      const { me } = reduxStore.getState();
      if (me.id !== null) {
        gd.presence.init();
      }
      const now = new Date();
      if (now.toDateString() != nativeAppDate.toDateString()) {
        nativeAppDate = now;
        // day passed, should update my work folders
        reduxStore.dispatch(myWorkChange());
      }
    }

    if (nativeAppState == 'active' && (nextState == 'inactive' || nextState == 'background')) {
      gd.presence.stop();
    }

    nativeAppState = nextState;
  }

  nativeAppState = AppState.currentState;
  AppState.addEventListener('change', handleAppStateChange);

  function handleConnectivityChange(connected) {
    window.nativeAppInternet = connected;
  }

  NetInfo.fetch().then(state => {
    window.nativeAppInternet = state.isConnected;
  });
  NetInfo.addEventListener(state => {
    handleConnectivityChange(state.isConnected)
  });

  // debug
  //localStorage.listAllKeys();

  const fcmActions = {
    loadTask(taskId) {
      return reduxStore.dispatch(loadTask(taskId));
    }
  };
  fcmController.setActions(fcmActions);

  // check real internet connection
  const p6 = new Promise((resolve, reject) => {
    fetch('https://www.google.com', {method:'get', credentials: 'omit'})
      .then(() => {
        console.log('real_internet_connection_ok');
        window.nativeAppInternet = true;
        resolve();
      }).catch(() => {
      console.log('real_internet_connection_off');
      resolve();
    });
  });


  //return Promise.all([p1, p2, p3, p4, p5, p6]);

  return new Promise((resolve, reject) => {
    Promise.all([p1, p2, p3, p4, p5, p6]).then(() => {

      if (window.nativeAppLoggedOut) {
        reduxStore.dispatch(rootScreenChange(rootScreenValue.login));
        resolve();
      } else {
        reduxStore.dispatch(myWorkLoad())
          .then(() => {
            console.log('prepare-start: session_loaded');
            fcmStart();
            resolve();
          })
          .catch(error => {
            console.log('prepare-start: session_not_loaded');
            fcmPause();
            if (error.code == 403) {
              //this.props.navigation.navigate('login');
              reduxStore.dispatch(rootScreenChange(rootScreenValue.login));
              resolve(); // go to login screen
            } else {
              window.sentryLogger.captureException(error);
              reject();
            }

          })
      }

    }).catch(e2 => {
      reject(); // base promises have rejections
    })
  })

}
