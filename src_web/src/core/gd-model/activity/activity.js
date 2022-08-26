const AmpersandStateExtended = require('../ampersand-state-extended');
const Project = require('../project/gd-project');
const Company = require('../company/company-basic');
const User = require('../user/gd-user-basic');
const Task = require('../task/task-basic');


module.exports = AmpersandStateExtended.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        message: 'string',
        messageType: 'number',
        communicationFlow: 'number',

        scheduleDate: 'gd-date',
        dateCreated: 'gd-datetime'
    },

    children: {
        project: Project,
        company: Company,
        user: User,
        task: Task
    },


    parse: function(obj) {
        // obj.dateCreated = DatetimeUtils.datetimeToMoment(obj.dateCreated);
        // obj.scheduleDate = DatetimeUtils.dateToMoment(obj.scheduleDate);
        return obj;
    }
});