var EventActionProto = require('../event-action-proto');

module.exports = class EventProjectTypeReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() {
        return true;
    }

    process() {
        gd.session.projectTypes.reset(this.data,{parse:true});
        super.process();
    }
};

