const CompanyUsersCollection = require('../../gd-model/company-user/company-users');
const EventActionProto = require('../event-action-proto');


module.exports = class EventCompanyUsersReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() {
        return true;
    }

    process() {
        gd.session.companyUsers.reset(this.data,{parse:true});
        super.process();
    }
};

