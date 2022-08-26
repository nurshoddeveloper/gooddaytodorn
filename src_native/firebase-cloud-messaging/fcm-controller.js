import { Platform } from 'react-native';
import _ from 'lodash';
import FCM, {
  FCMEvent,
  NotificationType,
  RemoteNotificationResult,
  WillPresentNotificationResult
} from 'react-native-fcm';
import { registerKilledListener } from './fcm-listeners';
import localStorage, { LS_FCM_TOKEN, LS_USER_ALLOWED_NOTIFICATIONS } from '../../src_web/src_web_changed/local-storage';
import apiCall from '../../src_web/src_web_changed/core/gd/data/api-call';

const ANDROID_ACTION_OPEN_TASK = 'goodday.action.OPEN_TASK';

registerKilledListener();

class FcmController {

  constructor() {
    this.actions = null;
    this.navigation = null;
    this.havePermissions = false;
    this.listenersRegistered = false;
    this.userId = null;
    this.fcmToken = null;
    this.fcmRefreshToken = null;
    this.apnsToken = null;
  }

  setUserId(id) {
    console.log('FcmController', 'setUserId', id);
    this.userId = id;
  }

  setActions(actions) {
    this.actions = actions;
  }

  setNavigation(nav) {
    this.navigation = nav;
  }

  async checkPermissions() {
    // check permissions first
    try {
      await FCM.requestPermissions({badge: false, sound: true, alert: true});
    } catch (e) {
      console.warn('no permissions', e);

      //todo remove registered tokens if any

      if (window.nativeAppFcmToken) {
        apiCall(this, 'post', 'push/fcm/delete', {token: window.nativeAppFcmToken});
        localStorage.deleteItem(LS_FCM_TOKEN);
        window.nativeAppFcmToken = null;
      }

      return false;
    }

    this.havePermissions = true;
    return true;
  }

  registerListeners() {
    console.log('FcmController', 'registerListeners', 'this.listenersRegistered', this.listenersRegistered);
    if (this.listenersRegistered) return;

    FCM.on(FCMEvent.Notification, notif => {
      console.log('FcmController', 'registerListeners', 'Notification', notif);

      /*
      if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
        // this notification is only to decide if you want to show the notification when user if in foreground.
        // usually you can ignore it. just decide to show or not.
        notif.finish(WillPresentNotificationResult.All);
        return;
      }
      */

      this.checkNeedTakeAction(notif);

      if (Platform.OS === 'ios') {
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
            // this type of notificaiton will be called only when you are in foreground.
            // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
            break;
        }
      }
    });

    FCM.getFCMToken().then(token => {
      console.log('FcmController', 'getFCMToken', token);
      this.fcmToken = token;
      //localStorage.setItem(LS_FCM_TOKEN, token);

    });

    /*
    if (Platform.OS === 'ios') {
      FCM.getAPNSToken().then(token => {
        console.log('FcmController', 'getAPNSToken', token);
        this.apnsToken = token;
        //localStorage.setItem(LS_FCM_APNS_TOKEN, token);
      });
    }
    */

    FCM.on(FCMEvent.RefreshToken, token => {
      console.log('FcmController', 'RefreshToken', token);
      this.fcmRefreshToken = token;
      //localStorage.setItem(LS_FCM_REFRESH_TOKEN, token);
    });

    FCM.enableDirectChannel();
    FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
      console.log('FcmController', 'direct channel connected' + data);
    });
    if (__DEV__) {
      setTimeout(function () {
        FCM.isDirectChannelEstablished().then(d => console.log('FcmController', 'isDirectChannelEstablished', d));
      }, 1000);
    }

    this.listenersRegistered = true;
    console.log('FcmController', 'registerListeners', 'this.listenersRegistered', this.listenersRegistered);
  }

  sendTokensToGoodday() {
    console.log('FcmController', 'sendTokensToGoodday', 'this.userId', this.userId);
    if (!this.userId) return;

    const platform = Platform.OS;

    if (this.fcmToken && this.fcmRefreshToken) {
      console.log('sendTokensToGoodday', 'case_1', 'token', this.fcmToken, 'refreshToken', this.fcmRefreshToken);

      let newToken = this.fcmToken;
      if (this.fcmRefreshToken != this.fcmToken) newToken = this.fcmRefreshToken;
      const oldToken = window.nativeAppFcmToken;

      if (window.nativeAppUserAllowedNotifications) {
        console.log('sendTokensToGoodday', 'case_1', 'allowed_notifications');

        if (oldToken && oldToken != newToken) {
          apiCall(this, 'post', 'push/fcm/refresh', {oldToken, newToken, platform});
        } else {
          apiCall(this, 'post', 'push/fcm/save', {token: newToken, platform});
        }

      } else {
        console.log('sendTokensToGoodday', 'case_1', 'not_allowed_notifications');

        let deleteTokens = [this.fcmToken, this.fcmRefreshToken];
        if (oldToken) deleteTokens.push(oldToken);
        deleteTokens = _.uniq(deleteTokens);
        deleteTokens.forEach(t => {
          apiCall(this, 'post', 'push/fcm/delete', {token: t});
        });
      }

      localStorage.setItem(LS_FCM_TOKEN, newToken);
      window.nativeAppFcmToken = newToken;


    } else if (this.fcmRefreshToken) {
      console.log('sendTokensToGoodday', 'case_2', 'refreshToken', this.fcmRefreshToken);

      const newToken = this.fcmRefreshToken;
      const oldToken = window.nativeAppFcmToken;

      if (window.nativeAppUserAllowedNotifications) {
        console.log('sendTokensToGoodday', 'case_2', 'allowed_notifications');

        if (oldToken && oldToken != newToken) {
          apiCall(this, 'post', 'push/fcm/refresh', {oldToken, newToken, platform});
        } else {
          apiCall(this, 'post', 'push/fcm/save', {token: newToken, platform});
        }

      } else {
        console.log('sendTokensToGoodday', 'case_2', 'not_allowed_notifications');

        let deleteTokens = [newToken];
        if (oldToken) deleteTokens.push(oldToken);
        deleteTokens = _.uniq(deleteTokens);
        deleteTokens.forEach(t => {
          apiCall(this, 'post', 'push/fcm/delete', {token: t});
        });
      }

      localStorage.setItem(LS_FCM_TOKEN, newToken);
      window.nativeAppFcmToken = newToken;

    } else if (this.fcmToken) {
      console.log('sendTokensToGoodday', 'case_3', 'token', this.fcmToken);

      const newToken = this.fcmToken;
      const oldToken = window.nativeAppFcmToken;

      if (window.nativeAppUserAllowedNotifications) {
        console.log('sendTokensToGoodday', 'case_3', 'allowed_notifications');

        if (oldToken && oldToken != newToken) {
          apiCall(this, 'post', 'push/fcm/refresh', {oldToken, newToken, platform});
        }
        if (!oldToken) {
          apiCall(this, 'post', 'push/fcm/save', {token: newToken, platform});
        }

      } else {
        console.log('sendTokensToGoodday', 'case_3', 'not_allowed_notifications');

        let deleteTokens = [newToken];
        if (oldToken) deleteTokens.push(oldToken);
        deleteTokens = _.uniq(deleteTokens);
        deleteTokens.forEach(t => {
          apiCall(this, 'post', 'push/fcm/delete', {token: t});
        });
      }

      localStorage.setItem(LS_FCM_TOKEN, newToken);
      window.nativeAppFcmToken = newToken;
    }

  }

  userChangedNotificationSettings(allowed) {
    const platform = Platform.OS;
    let p;
    if (allowed) {
      p = apiCall(this, 'post', 'push/fcm/save', {token: this.fcmToken, platform});
    } else {
      p = apiCall(this, 'post', 'push/fcm/delete', {token: this.fcmToken});
    }

    window.nativeAppUserAllowedNotifications = allowed;
    localStorage.setItem(LS_USER_ALLOWED_NOTIFICATIONS, allowed ? 'allowed' : 'not_allowed');

    return p;
  }

  checkNeedTakeAction(notif) {
    console.log('FcmController', 'checkNeedTakeAction', notif);
    if (!notif || !notif.opened_from_tray) return;

    //if (Platform.OS === 'android' && notif.click_action != ANDROID_ACTION_OPEN_TASK) return;

    if (notif.taskId) {
      this.launchOpenTask(notif.taskId);
    }
  }

  checkAppStartedFromNotification() {
    if (!this.userId) return;

    FCM.getInitialNotification().then(notif => {
      console.log('FcmController', 'getInitialNotification', notif);
      this.checkNeedTakeAction(notif);
    })

  }

  launchOpenTask(taskId) {
    console.log('launchOpenTask', taskId, 'this.userId', this.userId);
    if (!this.userId) return;

    if (this.navigation) {
      console.log('will try to open task', taskId);
      this.actions.loadTask(taskId);
      this.navigation.navigate('task_view');
    }
  }

  createNotificationChannel() {
    if (Platform.OS !== 'android') return;
    FCM.createNotificationChannel({
      id: 'channel_1',
      name: 'Default',
      description: 'Tasks notifications',
      priority: 'high'
    })
  }

  developerRemoveOldTokens() {
    // delete all old tokens for user, to test something

    apiCall(this, 'get', 'my-account/notifications')
      .then(data => {

        if (data && data.pushNotificationTokens) {
          data.pushNotificationTokens.forEach(pnt => {
            if (pnt.platform == 'ios' || pnt.platform == 'android') {
              console.log('delete token', pnt.platform, pnt.token);
              apiCall(this, 'post', 'push/fcm/delete', {token: pnt.token});
            }
          })
        }

      })
      .catch(e => {
        console.error(e);
      });

    return;

    const tokensToRemove = [
      '',
      '',
      '',
    ];
    tokensToRemove.forEach(t => {
      apiCall(this, 'post', 'push/fcm/delete', {token: t});
    })

  }

}

const fcmController = new FcmController();
export default fcmController;
