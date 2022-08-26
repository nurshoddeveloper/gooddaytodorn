const EventActionProto = require('../event-action-proto');
const UserClientData = require('../../client-data/user');
import localStorage, { LS_SESSION_TOKEN, LS_USER_LAST_EMAIL, LS_FCM_TOKEN, LS_USER_ALLOWED_NOTIFICATIONS } from '../../../../src_web_changed/local-storage';

class EventMeChange extends EventActionProto {

    constructor(uid, data) {

        const restartApps = ['my-account-email'];

        super(uid, data, restartApps);
    }

    validate() {
       return true;
    }

    process() {

        localStorage.getItem('gd.userId').then(curUserId => {
          if (curUserId && curUserId!=this.data.id) {

            localStorage.clear().then(() => {
              // set new curUserId
              localStorage.setItem('gd.userId',this.data.id);
              // andrew, save required data for native app
              localStorage.setItem(LS_SESSION_TOKEN, window.nativeAppSessionToken);
              localStorage.setItem(LS_USER_LAST_EMAIL, window.nativeAppLastEmail);
              localStorage.setItem(LS_FCM_TOKEN, window.nativeAppFcmToken);
              localStorage.setItem(LS_USER_ALLOWED_NOTIFICATIONS, window.nativeAppUserAllowedNotifications);
            });
          } else {
            // set new curUserId
            localStorage.setItem('gd.userId',this.data.id);
          }
        });

        const formatSettings = {
          date: 'MMM D',
          dateLong: 'ddd, MMM D, YYYY',
          time: 'h:mm a',
          weekStart: 'mon'
        };
        if (this.data.datetimeFormat) {
          if (this.data.datetimeFormat.date) formatSettings.date = this.data.datetimeFormat.date;
          if (this.data.datetimeFormat.time) formatSettings.time = this.data.datetimeFormat.time;
          if (this.data.datetimeFormat.dateLong) formatSettings.dateLong = this.data.datetimeFormat.dateLong;
          if (this.data.datetimeFormat.weekStart) formatSettings.weekStart = this.data.datetimeFormat.weekStart;
        }

        // virtual - datetime
        formatSettings.datetime = formatSettings.date + ' ' + formatSettings.time;

        gd.session.me.set({
          id: this.data.id,
          name: this.data.name,
          icon: this.data.icon,
          timezone: this.data.timezone,
          email: this.data.email,
          formatSettings: formatSettings,
          clientData: UserClientData.normalize(this.data.clientData)
        },{silent:false});

        super.process();


        // Js error tracker Sentry/Raven Sentry.io
        if (typeof(Raven) !== 'undefined') {
          Raven.setUserContext({
            email: this.data.email,
            userId: this.data.id
          });
        }

        // Live support set user info... (zopim)
        if (gd.liveSupport) {
          gd.liveSupport.setUserInfo(this.data.name,this.data.email);
        }

        //console.log('gd.session.me', gd.session.me);


    }

}

module.exports = EventMeChange;

