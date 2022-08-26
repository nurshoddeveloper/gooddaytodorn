var AmpersandState = require('ampersand-state');
var UserModel = require('../../user/gd-user-basic');
var Moment = require('moment');

module.exports = AmpersandState.extend({
    idAttribute: 'userId',
    props: {

        isEnabled: 'boolean',
        nextReportDate: 'object',
        duration: 'number',
        notificationUsers: 'array'
    },

    children: {
        user: UserModel
    },

    derived: {
        userId: {
            deps: ['user'],
            fn: function() {
                return this.user.id;
            }
        }
    },

    parse(obj) {

        obj.nextReportDate=(obj.nextReportDate)?Moment.utc(obj.nextReportDate).local():null;

        return obj;
    }
});