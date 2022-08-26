const GDCompany = require('../../gd-model/company/my-company');

const EventCompanyNew = function(uid,data) {

    this.data = data;
    this.uid = uid;
};

EventCompanyNew.prototype.validate = function(){
    return true;
};

EventCompanyNew.prototype.process = function(){

    const newModel = new GDCompany(this.data);
    gd.session.companies.add(newModel);
    gd.session.companies.sort();
    gd.session.recent.organizations.reInit();

    gd.initCurOrganizationId();

};


module.exports = EventCompanyNew;

