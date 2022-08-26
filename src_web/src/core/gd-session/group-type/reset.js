var EventActionProto = require('../event-action-proto');

module.exports = class EventGroupTypeReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() { return true; }

    process() {
        gd.session.groupTypes.reset(this.data,{parse:true});
        super.process();
    }
};

