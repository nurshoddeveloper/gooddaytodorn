var EventActionProto = require('../event-action-proto');

module.exports = class EventTaskTypeNew extends EventActionProto {

    constructor(uid, data) {

        //let restartApps = ['organization-settings-task-types','organization-settings-task-type'];
        let restartApps = [];
        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    process() {


        this.data.map(tt=>{

            if (!gd.session.taskTypes.get(tt['id'])) {
                gd.session.taskTypes.add([tt],{parse:true});
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

