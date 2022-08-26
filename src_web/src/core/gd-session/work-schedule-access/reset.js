const EventActionProto = require('../event-action-proto');

module.exports = class WorkScheduleAccessReset extends EventActionProto {

    constructor(uid, data) {
        let restartApps = [];
        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    process() {
        gd.session.workScheduleAccess.reset(this.data,{parse:true});
    }
};


