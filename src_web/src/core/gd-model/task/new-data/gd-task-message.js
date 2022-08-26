const _ = require('lodash');
const AmpersandStateExtended = require('../../ampersand-state-extended');
const Moment = require('moment');

const TaskMessage = AmpersandStateExtended.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        message: 'string',
        type: 'number',
        communicationFlow: 'number',

        fromUserId: 'string',
        toUserId: 'string',
        dateCreated: 'gd-datetime',

        taskStatusId: 'string',
        getBackTime: 'object',
        arUserReplyTimeMinutes: 'object', //moment.duration

        scheduleDate: 'gd-date',

        taskSystemStatusOld: 'number',
        taskSystemStatusNew: 'number',

        // task: 'object',

        editByUserId: 'string',
        editDate: 'gd-datetime'
    },

    derived: {
        isBlockStart: {
            deps: ['communicationFlow','taskSystemStatusOld','taskSystemStatusNew'],
            fn: function () {
                return (
                    _.includes([1, 5], this.communicationFlow) ||
                    ( gd.const.systemStatus.isClosed(this.taskSystemStatusOld) && gd.const.systemStatus.isOpen(this.taskSystemStatusNew) )
                );
            }
        },
        isComment: {
            deps: ['communicationFlow'],
            fn: function () {
                return (this.communicationFlow === 2);
            }
        },
        isNoReply: {
            deps: ['type'],
            fn: function () {
                return (this.type === 3);
            }
        },
        isSystem: {
            deps: ['type, communicationFlow'],
            fn: function () {

                if (this.type === gd.const.taskMessage.type.PRIORITY) return (!this.communicationFlow>0);
                return (this.type>9);
            }
        },
        isBlockEnd: {
            deps: ['taskSystemStatusOld','taskSystemStatusNew'],
            fn: function () {
                return gd.const.systemStatus.isClosed(this.taskSystemStatusNew);
            }
        }
    },

    parse(obj) {

        // obj.dateCreated = Moment.utc(obj.dateCreated).local();
        // obj.scheduleDate = (obj.scheduleDate)?Moment.utc(obj.scheduleDate).local():null;
        // obj.editDate = (obj.editDate)?Moment.utc(obj.editDate).local():null;

        obj.arUserReplyTimeMinutes = (obj.arUserReplyTimeMinutes)?Moment.duration(obj.arUserReplyTimeMinutes,'minutes'):null;
        obj.getBackTime = (obj.getBackTime)?Moment.duration(obj.getBackTime,'minutes'):null;

        return obj;
    }
});

module.exports = TaskMessage;