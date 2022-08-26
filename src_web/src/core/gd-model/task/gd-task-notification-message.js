const AmpersandStateExtended = require('../ampersand-state-extended');
const Moment = require('moment');

const TaskMessage = AmpersandStateExtended.extend({
    idAttribute: 'id',
    props: {
        communicationFlow: 'number',
        fromUserId: 'string',
        message: 'string',
        scheduleDate: 'gd-date',

        sysStatusNew: 'number',
        sysStatusOld: 'number',

        taskId: 'string',

        taskStatusId: 'string',

        toUserId: 'string',

        type: 'number'
    },

    parse(obj) {

        // obj.scheduleDate = obj.scheduleDate ? Moment(obj.scheduleDate) : null;

        return obj;
    }
});

module.exports = TaskMessage;