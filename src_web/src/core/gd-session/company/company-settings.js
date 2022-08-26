const EventActionProto = require('../event-action-proto');
const OrganizationClientData = require('../../../core/client-data/organization');

module.exports = class EventCompanySettings extends EventActionProto {

    constructor(uid, data) {
        const restartApps = [];
        super(uid, data,restartApps);
    }

    validate() {
        return true;
    }

    process() {
        const sessionOrganization = gd.session.companies.get(this.data.id);

        if (sessionOrganization) {
            sessionOrganization.set({
                settings:           this.data.settings ? OrganizationClientData.normalize(this.data.settings) : null
            },{silent:false});

            super.process();
        }
    }
};