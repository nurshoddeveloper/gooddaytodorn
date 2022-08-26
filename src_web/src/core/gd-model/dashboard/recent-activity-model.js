var AmpersandState = require('ampersand-state');
var User = require('../user/gd-user-basic');
var Task = require('../task/gd-task');
var Moment = require('moment');

module.exports = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        message: 'string',
        messageType: 'number',
        communicationFlow: 'number',

        date: 'object'
    },

    children: {
        user: User,
        task: Task
    },

    parse: function(obj) {

        obj.date = Moment.utc(obj.date).local();

        return obj;
    }
});