var EventActionProto = require('../event-action-proto');
var TilesCollection = require('../../gd-model/dashboard/tile-collection');

module.exports = class EventDashboardReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() {
        return true;
    }

    process() {

        //gd.session.dashboard = new TilesCollection(this.data.tiles);
        gd.session.dashboard.reset(this.data.tiles,{parse:true});
        gd.session.dashboardActivity.reset(this.data.activity,{parse:true});

        super.process();
    }
};