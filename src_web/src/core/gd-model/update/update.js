const AmpersandState = require('ampersand-state');
//const User = require('../user/gd-user-basic');
//const Project = require('../project/gd-project');
//const Company = require('../company/company-basic');
const TaskNotificationMessage = require('../task/gd-task-notification-message');
//const ProjectHistoryModel = require('../project-history/project-history');
const Moment = require('moment');


const Update = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        momentCreated: 'object',
        companyId: 'string',
        task: 'object',

        taskMessage: 'object'
    },

    parse(obj) {

        obj.momentCreated = obj.momentCreated ? new Moment.utc(obj.momentCreated).local() : null;
        obj.taskMessage = obj.taskMessage ? new TaskNotificationMessage(obj.taskMessage,{parse:true}):null;

        return obj;
    }

});

module.exports = Update;