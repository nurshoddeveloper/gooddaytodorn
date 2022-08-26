var EventActionProto = require('../event-action-proto');
// const BoardCollection = require('../../gd-model/board/board-collection');

module.exports = class EventBoardsReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() { return true; }

    process() {
        // if (!gd.session.boardsAll) {
        //     gd.session.boardsAll = new BoardCollection(this.data,{parse:true});
        // } else {
        //     gd.session.boardsAll.reset(this.data);
        // }

        // reset menu
        gd.session.boardsMenu.reset(this.data);


        super.process();
    }
};

