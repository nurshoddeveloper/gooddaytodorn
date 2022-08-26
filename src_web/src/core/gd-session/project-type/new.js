const EventActionProto = require('../event-action-proto');

module.exports = class EventProjectTypeNew extends EventActionProto {

    constructor(uid, data) {
        let restartApps = [];
        super(uid, data, restartApps);
    }

    process() {


        this.data.map(pt=>{

            if (!gd.session.projectTypes.get(pt['id'])) {
                gd.session.projectTypes.add([pt],{parse:true});
                // add
            } else {
                // update
                //gd.session.statuses.get(s['id']).set({
                //    name: s['name'],
                //    color: s['color'],
                //    isDeleted: s['isDeleted']
                //});
                console.error("not meant to happen...");
            }


        });


        super.process();
    }
};

