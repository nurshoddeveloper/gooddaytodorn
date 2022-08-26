const AmpersandState = require('ampersand-state');
const TaskNotificationMessage = require('./task-notification-message');
const Moment = require('moment');


const Update = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        momentCreated: 'object',
        companyId: 'string',
        projectId: 'string',
        userId: 'string',

        task: 'object',
        taskMessage: 'object',

        projectUpdate: 'object',

        event: 'object',
        eventUpdate: 'object'
    },

    parse(obj) {

        obj.momentCreated = obj.momentCreated ? new Moment.utc(obj.momentCreated).local() : null;
        obj.taskMessage = obj.taskMessage ? new TaskNotificationMessage(obj.taskMessage,{parse:true}):null;

        return obj;
    }

});

module.exports = Update;