var EventActionProto = require('../event-action-proto');

module.exports = class EventProjectTypeResetByCompany extends EventActionProto {

    constructor(uid, data) {

        let restartApps = ['organization-settings-project-types','organization-settings-project-type'];

        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    process() {
        var companyId = this.data[0].companyId;

        gd.session.projectTypes.resetByCompany(companyId, this.data);
        super.process();
    }
};

