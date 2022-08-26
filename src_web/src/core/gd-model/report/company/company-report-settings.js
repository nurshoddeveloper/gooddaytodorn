var AmpersandState = require('ampersand-state');
var CompanyModel = require('../../company/company-basic');
var Moment = require('moment');

module.exports = AmpersandState.extend({
    idAttribute: 'companyId',
    props: {

        isEnabled: 'boolean',
        nextReportDate: 'object',
        duration: 'number',
        notificationUsers: 'array'
    },

    children: {
        company: CompanyModel
    },

    derived: {
        companyId: {
            deps: ['company'],
            fn: function() {
                return this.company.id;
            }
        }
    },

    parse(obj) {
        obj.nextReportDate=(obj.nextReportDate)?Moment.utc(obj.nextReportDate).local():null;
        return obj;
    }
});