var AmpersandState = require('ampersand-state');
var DepartmentModel = require('../../department/gd-department');
var Moment = require('moment');

module.exports = AmpersandState.extend({
    idAttribute: 'departmentId',
    props: {

        isEnabled: 'boolean',
        nextReportDate: 'object',
        duration: 'number',
        notificationUsers: 'array'
    },

    children: {
        department: DepartmentModel
    },

    derived: {
        departmentId: {
            deps: ['department'],
            fn: function() {
                return this.department.id;
            }
        }
    },

    parse(obj) {
        obj.nextReportDate=(obj.nextReportDate)?Moment.utc(obj.nextReportDate).local():null;
        return obj;
    }
});