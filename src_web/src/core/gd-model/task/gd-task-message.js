const _ = require('lodash');
const AmpersandStateExtended = require('../ampersand-state-extended');
const User = require('../user/gd-user-basic');
const Moment = require('moment');
const TaskModel = require('./gd-task');
const StatusModel = require('../status/status-model');

const TaskMessage = AmpersandStateExtended.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        message: 'string',
        type: 'number',
        communicationFlow: 'number',

        fromUser: 'object',
        toUser: 'object',
        dateCreated: 'gd-datetime',

        taskStatus: 'object',
        getBackTime: 'object',
        arUserReplyTime: 'object', //moment.duration

        scheduleDate: 'gd-date',

        taskSystemStatusOld: 'number',
        taskSystemStatusNew: 'number',

        task: 'object',

        editByUser: 'object',
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
                return (this.communicationFlow==2);
            }
        },
        isNoReply: {
            deps: ['type'],
            fn: function () {
                return (this.type==3);
            }
        },
        isSystem: {
            deps: ['type, communicationFlow'],
            fn: function () {

                if (this.type==gd.const.taskMessage.type.PRIORITY) return (!this.communicationFlow>0);
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

    parse: function(obj) {
        obj.fromUser = new User(obj.fromUser);
        obj.toUser = (obj.toUser && obj.toUser.id)?new User(obj.toUser):null;

        // obj.dateCreated = Moment.utc(obj.dateCreated).local();
        // obj.scheduleDate = (obj.scheduleDate)?Moment(obj.scheduleDate):null;
        // obj.editDate = (obj.editDate)?Moment.utc(obj.editDate).local():null;

        obj.taskStatus = (obj.taskStatus && obj.taskStatus.id)?new StatusModel(obj.taskStatus):null;

        obj.arUserReplyTime = (obj.arUserReplyTimeMinutes)?Moment.duration(obj.arUserReplyTimeMinutes,'minutes'):null;
        obj.getBackTime = (obj.getBackTime)?Moment.duration(obj.getBackTime,'minutes'):null;

        obj.task = (obj.task)?new TaskModel(obj.task,{parse:true}):null;
        obj.editByUser = (obj.editByUser)?new User(obj.editByUser):null;

        return obj;
    }
});

module.exports = TaskMessage;