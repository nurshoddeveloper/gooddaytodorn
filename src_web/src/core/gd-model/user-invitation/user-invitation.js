var AmpersandState = require('ampersand-state');

var DepartmentModel = require('../department/gd-department');
var ProjectModel = require('../project/project-basic');
var CompanyModel = require('../company/company-basic');
var UserModel = require('../user/gd-user-basic');

var Moment = require('moment');

module.exports = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        name: 'string',
        email: 'string',
        date: 'object',
        project: 'object',
        companyRole: 'number',
        department: 'object',
        invitationKey: 'string',
        company: 'object',
        fromUser: 'object'
    },
    derived: {

        howOld: {
            deps: ['date'],
            fn: function () {
                return gd.utils.howOldFormatted(this.date)
            }
        }

    },

    parse: function(obj) {
        if (obj.department) {
            obj.department = new DepartmentModel(obj.department);
        }
        if (obj.project) {
            obj.project = new ProjectModel(obj.project);
        }
        obj.date = (obj.date)?Moment.utc(obj.date).local():null;
        obj.company = (obj.company)?new CompanyModel(obj.company):null;
        obj.fromUser = (obj.fromUser)?new UserModel(obj.fromUser):null;

        return obj;
    }
});