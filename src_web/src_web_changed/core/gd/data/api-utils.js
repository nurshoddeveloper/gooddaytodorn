import localStorage, { LS_SESSION_TOKEN } from '../../../local-storage';

const debug = true;

export default {
  addGetParams: function(url, data) {
    const firstSep = url.indexOf('?') > -1 ? '&' : '?';
    let c = 0;
    for (const key of Object.keys(data)) {
      let val = data[key];
      if (val === undefined || val === null) val = '';
      const sep = c === 0 ? firstSep : '&';
      url += sep + key + '=' + encodeURIComponent(val);
      c++;
    }
    return url;
  },
  checkStatus: function(response) {
    if (response.status >= 200 && response.status < 300) {
      //if (debug) console.log('api-utils: response', response);
      return response;
    } else {
      if (debug) console.log('api-utils: checkStatus', response);

      let code = 500;
      let errorMessage;

      if (response.status == 0) {
        errorMessage = 'No connection.\n Verify Network.';
      } else if (response.status == 404) {
        errorMessage = 'Requested page not found.';
        code = 404;
      } else if (response.status == 403) {
        errorMessage = 'Auth error.';
        code = 403;
      } else if (response.status == 500) {
        errorMessage = 'Internal Server Error [500].';
      } else if (response.status == 503) {
        errorMessage = 'Internal Server Error [503].';
      } else {
        errorMessage = 'Uncaught Error.\n' + response.status + ' ' + response.statusText;
      }

      const err = new Error(errorMessage);
      err.code = code;
      throw err;
    }
  },
  checkTokenUpdate(response) {
    /*if (response.headers && response.headers.map) {
      //console.log('checkTokenUpdate', response.headers);
      if ('sessiontokenupdate' in response.headers.map) {
        const arr = response.headers.map.sessiontokenupdate;
        if (debug) console.log('sessiontokenupdate received');
        if (Array.isArray(arr)) {
          const sessionTokenUpdate = arr[0];
          if (debug) console.log('sessiontokenupdate', sessionTokenUpdate);
          window.nativeAppSessionToken = sessionTokenUpdate;
          localStorage.setItem(LS_SESSION_TOKEN, sessionTokenUpdate);
        }
      }
    }*/
    if (response && response.headers) {
      if (response.headers.has('sessiontokenupdate')) {
        const stu = response.headers.get('sessiontokenupdate');
        if (debug) console.log('sessiontokenupdate received', stu);
        window.nativeAppSessionToken = stu;
        localStorage.setItem(LS_SESSION_TOKEN, stu);
      }
    }
    return response;
  },
  parseJson: function(response) {
    let json = {};
    try {
      //json = JSON.parse(response); // full object, headers, etc
      json = response.json();
    } catch (e) {
      if (debug) {
        console.log('api-utils: parseJson', e);
        //console.log('response', typeof response, response);
      }
      const err = new Error('Requested JSON parse failed.');
      err.code = 500;
      throw err;
    }
    return json;
  },
  paramsReplacer: function(key, value) {
    if (value === undefined) return null;
    return value;
  }
};
