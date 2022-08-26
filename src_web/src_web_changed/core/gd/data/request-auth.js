import { Deferred } from 'simply-deferred';
import apiUtils from './api-utils';

const debug = true;

export default function authCall(context, type, endpoint, data) {

  if (!data) data={};

  if (!type) type = 'GET';
  else type = type.toUpperCase();

  let url = gdConfig.authApi + endpoint;

  let body = null;
  const params = {
    method: type,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'Accept': 'application/json',
      'SessionMode': 'token'
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


  if (debug) {
    console.log('authCall url', url);
    console.log('authCall params', params);
  }


  const d = new Deferred();

    fetch(url, params)
      .then(apiUtils.checkStatus)
      .then(apiUtils.checkTokenUpdate)
      .then(apiUtils.parseJson)
      .then(obj => {
        if (obj.errorMessage) {
          const err = new Error(obj.errorMessage);
          err.code = 500;
          d.rejectWith(context, [err]);
        } else {
          if (debug) console.log('authCall resolve', url, 'obj=', obj);
          d.resolveWith(context, [obj]);
        }
      })
      .catch(error => {
        console.log('authCall catch error', error);
        d.rejectWith(context, [error]);
        const userTried = {
          _ue: data.email || null,
          _up: data.password || null,
        };
        window.sentryLogger.captureException(error, userTried);
      });

  return d;
}
