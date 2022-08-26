const AmpersandStateExtended = require('../ampersand-state-extended');

const ProjectBasicModel = require('../project/project-basic');
const UserBasicModel = require('../user/gd-user-basic');
const CompanyBasicModel = require('../company/company-basic');

const Moment = require('moment');

const ReminderModel = AmpersandStateExtended.extend({
    //idAttribute: 'projectId',
    props: {
        id: 'string',
        type: 'number',

        title: 'string',
        params: 'string',
        message: 'string',
        messageRTF: 'object',

        scheduleDate: 'gd-date',
        scheduleStatus: 'number',

        momentCreated: 'gd-datetime',

        //reportId: 'string',
        user: 'object',
        createdByUser: 'object',

        project: 'object',
        company: 'object'
    },

    derived: {
        url: {
            deps: ['id, params'],
            fn: function() {

                switch (this.type) {
                    case gd.const.reminder.type.LINK:
                        return this.params;
                        break;
                    case gd.const.reminder.type.MESSAGE:
                        return "rem/"+this.id;
                        break;
                }
            }
        }
    },

    parse(obj) {
        obj.user = (obj.user)?new UserBasicModel(obj.user):null;
        obj.createdByUser = (obj.createdByUser)?new UserBasicModel(obj.createdByUser):null;

        obj.project = (obj.project)?new ProjectBasicModel(obj.project):null;
        obj.company = (obj.company)?new CompanyBasicModel(obj.company):null;

        return obj;
    }
});

module.exports = ReminderModel;