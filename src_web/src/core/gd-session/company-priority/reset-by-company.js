var EventActionProto = require('../event-action-proto');

module.exports = class EventCompanyPrioritiesResetByCompany extends EventActionProto {

    constructor(uid, data) {
        super(uid, data);
    }

    validate() {
        return true;
    }

    process() {

        gd.session.companies.get(this.data.companyId).priorities.setName(1,this.data.p1);
        gd.session.companies.get(this.data.companyId).priorities.setName(2,this.data.p2);
        gd.session.companies.get(this.data.companyId).priorities.setName(3,this.data.p3);
        gd.session.companies.get(this.data.companyId).priorities.setName(4,this.data.p4);
        gd.session.companies.get(this.data.companyId).priorities.setName(5,this.data.p5);
        gd.session.companies.get(this.data.companyId).priorities.setName(6,this.data.p6);
        gd.session.companies.get(this.data.companyId).priorities.setName(7,this.data.p7);
        gd.session.companies.get(this.data.companyId).priorities.setName(8,this.data.p8);
        gd.session.companies.get(this.data.companyId).priorities.setName(9,this.data.p9);
        gd.session.companies.get(this.data.companyId).priorities.setName(10,this.data.p10);
        gd.session.companies.get(this.data.companyId).priorities.setName(100,this.data.p100);

        super.process();
    }
};