var EventActionProto = require('../event-action-proto');

module.exports = class EventTaskTypeResetByCompany extends EventActionProto {

    constructor(uid, data) {

        let restartApps = ['organization-settings-task-types','organization-settings-task-type'];

        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    process() {
        let companyId = this.data[0].companyId;
        gd.session.taskTypes.resetByCompany(companyId,this.data);
        super.process();
    }
};

