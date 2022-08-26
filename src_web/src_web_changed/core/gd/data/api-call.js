import { Deferred } from 'simply-deferred';
import Moment from 'moment';
import apiUtils from './api-utils';
import { Platform, ToastAndroid, Alert } from 'react-native';
const debug = true;

function apiCall(context, type, endpoint, data, headers, formdata) {
  if (!data) data={};
  data.zz = Moment().format('ZZ');

  if (!type) type = 'GET';
  else type = type.toUpperCase();

  let url = gdConfig.apiUrl + endpoint;

  let body = null;
  const params = {
    method: type,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'Accept': 'application/json',
      'SessionMode': 'token',
      'SessionToken': window.nativeAppSessionToken,
      ...headers
    },
    credentials: 'omit'
  };
  if (data) {
    if (type === 'GET') {
      url = apiUtils.addGetParams(url, data);
    } else {
      body = JSON.stringify(data, apiUtils.paramsReplacer);
    }
  }
  if (body) params.body = body;

  if (formdata) params.body = formdata

  if (debug) {
    // console.log('apiCall url', url);
    // console.log('apiCall params', params);
  }


  const d = new Deferred();

  if (gdConfig.nativeApp && !window.nativeAppInternet) {
    if (Platform.OS == 'android') {
      ToastAndroid.showWithGravity('Seems you have no internet connection', ToastAndroid.LONG, ToastAndroid.CENTER);
    } else {
      Alert.alert(
        'Warning',
        'Seems you have no internet connection',
        [
          {text: 'Ok', onPress: () => {}},
        ]
      )
    }
    const err = new Error('No internet connection');
    err.code = 'error_no_internet';
    d.rejectWith(context, [err]);
    return d;
  }

  fetch(url, params)
    .then(apiUtils.checkStatus)
    .then(apiUtils.checkTokenUpdate)
    .then(apiUtils.parseJson)
    .then(obj => {
      console.log('obj', obj);
      if (!obj) {
        // obj might be null
        d.resolveWith(context, [null]);
      } else {
        if (obj.errors) {
          d.rejectWith(context, [obj.errors]);
        } else {
          let gotSession = null;

          if (obj.data && obj.data.session) gotSession = obj.data.session;
          else if (obj.session) gotSession = obj.session;

          if (gotSession) {
            if (debug) console.log('apiCall', 'got session');
            gd.session.processEvents(gotSession);
          }

          const data2 = obj && obj.data ? obj.data : obj;
          if (debug) console.log('apiCall resolve', url);
          d.resolveWith(context, [data2]);
        }
      }
    })
    .catch(error => {
      console.log('apiCall catch error', error, url);
      d.rejectWith(context, [error]);
      window.sentryLogger.captureException(error);
    });

  d.catch(e => {
    debug && console.log('apiCall d.catch', e);
  });

  return d;
}

module.exports = apiCall;  // old style for compatibility
