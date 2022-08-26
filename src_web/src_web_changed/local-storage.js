import store from 'react-native-simple-store';

export const LS_USER_LAST_EMAIL = 'rn_lastEmail';  // last email user logged in to show in login form
export const LS_USER_LOGGED_OUT = 'rn_loggedOut'; // flag to show login screen on start
export const LS_SESSION_TOKEN = 'rn_sessionToken'; // goodday server auth token
export const LS_FCM_TOKEN = 'rn_fcm_token';
export const LS_FCM_APNS_TOKEN = 'rn_fcm_apns_token';
export const LS_USER_ALLOWED_NOTIFICATIONS = 'rn_userAllowedNotifications';


class LS {
  getItem(key) {
    return store.get(key);
  }
  setItem(key, value) {
    return store.save(key, value);
  }
  deleteItem(key) {
    return store.delete(key);
  }
  clear2() {
    store.keys().then(keys => {
      keys.forEach(k => {
        store.delete(k);
      })
    });
  }
  async clear() {
    const keys = await store.keys();
    keys.forEach(k => {
      store.delete(k);
    });
  }
  async listAllKeys() {
    const keys = await store.keys();
    keys.forEach(k => {
      console.log('localStorage key:', k);
    });
  }
}

const ls = new LS();

export default ls;