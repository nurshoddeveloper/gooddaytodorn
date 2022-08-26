const AmpersandState = require('ampersand-state');


const SessionCounters = AmpersandState.extend({

    props: {
        notifications: 'number'
    },

    increaseNotificationsCount(){
        this.notifications++;
    },

    setNotificationsCount(value){
        this.notifications = value;
    },

    getNotificationsCount(){
        return this.notifications;
    }
});

module.exports = SessionCounters;