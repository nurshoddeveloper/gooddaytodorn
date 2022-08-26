var EventActionProto = require('../event-action-proto');
var CompanyUserModel = require('../../gd-model/company-user/company-user');

module.exports = class EventCompanyUsersDelete extends EventActionProto {

    constructor(uid, data) {
        var restartApps = [];
        super(uid, data,restartApps);
    }

    validate() {
        return true;
    }

    process() {

        var companyUser = gd.session.companyUsers.get(this.data.companyId+"-"+this.data.userId);
        if (companyUser) {
            gd.session.companyUsers.remove(companyUser);
        } else {
            console.error("unkonown company user. can't delete");
        }

        super.process();
    }
};

