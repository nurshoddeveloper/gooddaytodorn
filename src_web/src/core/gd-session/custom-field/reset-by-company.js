const EventActionProto = require('../event-action-proto');

module.exports = class EventCustomFieldsResetByCompany extends EventActionProto {

    constructor(uid, data) {
        let restartApps = ['organization-settings-custom-fields'];
        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    process() {
        gd.session.customFields.resetByCompany(this.data.companyId,this.data.customFields);
        super.process();
    }
};

