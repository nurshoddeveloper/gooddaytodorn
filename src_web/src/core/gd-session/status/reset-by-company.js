var EventActionProto = require('../event-action-proto');

module.exports = class EventStatusResetByCompany extends EventActionProto {

    constructor(uid, data) {

        let restartApps = ['organization-settings-task-type','organization-settings-project-type'];

        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    process() {
        var companyId = this.data[0].companyId;
        gd.session.statuses.resetByCompany(companyId, this.data);

        gd.session.taskTypes.reinit();
        gd.session.projectTypes.reinit();

        super.process();
    }
};

