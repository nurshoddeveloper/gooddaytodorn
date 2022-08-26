var EventActionProto = require('../event-action-proto');
var CompanyUserModel = require('../../gd-model/company-user/company-user');

module.exports = class EventCompanyUsersResetByCompany extends EventActionProto {

    constructor(uid, data) {
        var restartApps = [];
        super(uid, data,restartApps);
    }

    validate() {
        return true;
    }

    process() {

        var user = gd.session.users.get(this.data.userId);
        var company = gd.session.companies.get(this.data.companyId);

        if (!user) {
            gd.session.users.add(this.data.user);
            user = gd.session.users.get(this.data.userId);
        }

        var newCompanyUserModel = new CompanyUserModel({
            userId: this.data.userId,
            companyId: this.data.companyId,
            companyRole: this.data.companyRole,
            departmentId: this.data.departmentId,
            reportToUserId: this.data.reportToUserId
        },{parse:true});

        gd.session.companyUsers.add(newCompanyUserModel);

        super.process();
    }
};

