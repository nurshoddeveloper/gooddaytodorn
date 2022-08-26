const EventActionProto = require('../event-action-proto');


module.exports = class EventCompanyUsersResetByCompany extends EventActionProto {

    constructor(uid, data) {
        const restartApps = [];
        super(uid, data,restartApps);
    }

    validate() {
        return true;
    }

    process() {

        const companyId = this.data[0]['companyId'];

        gd.session.companyUsers.resetByCompany(companyId,this.data);
        super.process();
    }
};

