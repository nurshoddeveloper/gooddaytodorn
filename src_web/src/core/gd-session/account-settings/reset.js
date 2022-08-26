const EventActionProto = require('../event-action-proto');

module.exports = class EventAccountSettingsReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() {
        return true;
    }

    process() {
        const { menu, notes } = this.data;
        if (menu) gd.session.accountSettings.menu = menu;
        if (notes) gd.session.accountSettings.notes = notes;
        super.process();
    }
};

