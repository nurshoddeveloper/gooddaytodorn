var EventActionProto = require('../event-action-proto');


module.exports = class EventStatusReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() { return true; }

    process() {
        gd.session.statuses.reset(this.data,{parse:true});
        super.process();
    }
};