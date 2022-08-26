import { Platform } from 'react-native';
import { Sentry, SentrySeverity } from 'react-native-sentry';


export function sentryStart() {
  if (__DEV__) {
    console.log('debug env, sentry not started');
    window.sentryLogger = fakeSentryLogger;
    return;
  }

  let url = 'https://5c3a482b56724f3dbad2c76219bac8c5@o514728.ingest.sentry.io/5618427';
  if (Platform.OS === 'ios') {
    url = 'https://268c85a9cb8c4f6daffe67a088fc9e78@o514728.ingest.sentry.io/5618428';
  }

  Sentry.config(url).install();

  window.sentryLogger = sentryLogger;

  Sentry.setTagsContext({
    'environment': __DEV__ ? 'debug' : 'production'
  });

  //window.sentryLogger.captureMessageInfo('test message');
}

const sentryLogger = {

  setUserContext(data) {
    Sentry.setUserContext(data);
  },

  setGuestContext() {
    Sentry.setUserContext({id:'', name:'guest', email:'guest@guest.guest'});
  },

  captureException(ex, extra) {
    if (!window.nativeAppLoggedOut && !window.nativeAppFirstAuthErrorProcessed && ex.code == 403) {
      window.nativeAppFirstAuthErrorProcessed = true;
      return;
    }
    const options = extra ? {extra} : {};
    Sentry.captureException(ex, options);
  },

  captureMessageError(message, extra) {
    const options = extra ? {level: SentrySeverity.Error, extra} : {level: SentrySeverity.Error};
    Sentry.captureMessage(message, options);
  },

  captureMessageWarning(message, extra) {
    const options = extra ? {level: SentrySeverity.Warning, extra} : {level: SentrySeverity.Warning};
    Sentry.captureMessage(message, options);
  },

  captureMessageInfo(message, extra) {
    if (!window.nativeAppLoggedOut && !window.nativeAppFirstAuthInfoProcessed && message == window.nativeAppAuthInfoMessage) {
      window.nativeAppFirstAuthInfoProcessed = true;
      return;
    }
    const options = extra ? {level: SentrySeverity.Info, extra} : {level: SentrySeverity.Info};
    Sentry.captureMessage(message, options);
  }

};

const fakeSentryLogger = {
  setUserContext() {},
  setGuestContext() {},
  captureException(ex) {
    if (!window.nativeAppLoggedOut && !window.nativeAppFirstAuthErrorProcessed && ex.code == 403) {
      window.nativeAppFirstAuthErrorProcessed = true;
      console.log('fakeSentryLogger.captureException firstAuthError');
      return;
    }
    console.log('fakeSentryLogger.captureException', ex.code, ex)
  },
  captureMessageError(message, extra) {
    console.log('fakeSentryLogger.captureMessageError', message, extra);
  },
  captureMessageWarning(message, extra) {
    console.log('fakeSentryLogger.captureMessageWarning', message, extra);
  },
  captureMessageInfo(message, extra) {
    if (!window.nativeAppLoggedOut && !window.nativeAppFirstAuthInfoProcessed && message == window.nativeAppAuthInfoMessage) {
      window.nativeAppFirstAuthInfoProcessed = true;
      console.log('fakeSentryLogger.captureMessageInfo firstAuthInfo');
      return;
    }
    console.log('fakeSentryLogger.captureMessageInfo', message, extra)
  }
};
