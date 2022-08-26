var EventActionProto = require('../event-action-proto');

module.exports = class EventBoardsReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() { return true; }

    process() {
        gd.session.boardsMenu.reset(this.data);
        super.process();
    }
};

