const AmpersandStateExtended = require('../ampersand-state-extended');
const Moment = require('moment');

const TaskModel = require('./whats-done-task');
const GDUser = require('../../gd-model/user/gd-user-basic');

module.exports = AmpersandStateExtended.extend({

    idAttribute: 'id',

    props: {
        id: 'string',
        communicationFlow: 'number',
        dateCreated: 'gd-datetime',
        estimatedTime: 'number',
        message: 'string',
        reportedTime: 'number',
        project: 'object',
        taskType: 'object',
        user: 'object'
    },

    children: {
        task: TaskModel,
    },

    derived: {},

    parse: function (obj) {
        if (obj.user) obj.user = new GDUser(obj.user, {parse: true});
        return obj;
    }
});