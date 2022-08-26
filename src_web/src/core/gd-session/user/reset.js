const EventActionProto = require('../event-action-proto');

class EventUsersReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() {
        return true;
    }

    process() {
        gd.session.users.reset(this.data,{parse:true});
        super.process();
    }
}


module.exports = EventUsersReset;