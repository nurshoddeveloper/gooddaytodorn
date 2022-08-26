const AmpersandState = require('ampersand-state');

const Moment = require('moment');

const TaskNotificationMessage = AmpersandState.extend({
    idAttribute: 'id',

    props: {
        communicationFlow: 'number',
        fromUserId: 'string',
        message: 'string',
        scheduleDate: 'object',
        sysStatusNew: 'number',
        sysStatusOld: 'number',
        taskId: 'string',
        taskStatusId: 'string',
        toUserId: 'string',
        type: 'number'
    },

    parse(obj) {
        obj.scheduleDate = obj.scheduleDate ? Moment.utc(obj.scheduleDate).local() : null;
        return obj;
    }
});

module.exports = TaskNotificationMessage;