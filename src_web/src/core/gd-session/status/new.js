var EventActionProto = require('../event-action-proto');

module.exports = class EventStatusNew extends EventActionProto {

    constructor(uid, data) {

        //let restartApps = ['organization-settings-task-type','organization-settings-project-type'];
        let restartApps = [];
        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    process() {

        this.data.map(s=>{

            if (!gd.session.statuses.get(s['id'])) {
                gd.session.statuses.add([s],{parse:true});
                // add
            } else {
                // update
                gd.session.statuses.get(s['id']).set({
                    name: s['name'],
                    color: s['color'],
                    isDeleted: s['isDeleted']
                });
            }


        });

        super.process();
    }
};

