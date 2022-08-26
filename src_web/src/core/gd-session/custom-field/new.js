const EventActionProto = require('../event-action-proto');

module.exports = class EventCustomFieldNew extends EventActionProto {

    constructor(uid, data) {
        let restartApps = [];
        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    process() {
        if (!gd.session.customFields.get(this.data.id)) {
            gd.session.customFields.add([this.data],{parse:true});
            // add
        }
        super.process();
    }
};

