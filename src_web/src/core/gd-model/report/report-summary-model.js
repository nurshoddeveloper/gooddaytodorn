const AmpersandState = require('ampersand-state');

// const ProjectBasicModel = require('../project/project-basic');
// const UserBasicModel = require('../user/gd-user-basic');
// const CompanyBasicModel = require('../company/company-basic');

const Moment = require('moment');

const ReportSummaryModel = AmpersandState.extend({

    props: {
        startDate: 'object',
        endDate: 'object',

        reportType: 'number',
        reportId: 'string',

        project: 'object',
        user: 'object',
        company: 'object'
    },

    derived: {
        url: {
            deps: ['reportType,reportId'],
            fn: function() {

                switch (this.reportType) {
                    case gd.const.report.reportType.COMPANY_USER:
                        return "r/u/"+this.user.id+"/"+this.reportId;
                        break;
                    case gd.const.report.reportType.PROJECT:
                        return "r/p/"+this.project.id+"/"+this.reportId;
                        break;
                }

            }
        }
    },

    parse(obj) {

        obj.startDate = Moment(obj.startDate);
        obj.endDate = Moment(obj.endDate);

        obj.project = obj.reportProjectId ? gd.session.projects.get(obj.reportProjectId) : null;
        obj.user = obj.reportUserId ? gd.session.users.get(obj.reportUserId) : null;
        // obj.company = (obj.company)?new CompanyBasicModel(obj.company):null;

        return obj;
    }
});

module.exports = ReportSummaryModel;