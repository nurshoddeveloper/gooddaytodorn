const EventActionProto = require('../event-action-proto');


module.exports = class EventCompanyPriorityReset extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() {
        return true;
    }

    process() {

        if (this.data) { // user may remove his last company

            this.data.map(function(priority){
                gd.session.companies.get(priority.companyId).priorities.setName(priority.priority,priority.name);
            });

        }



        super.process();
    }
};

