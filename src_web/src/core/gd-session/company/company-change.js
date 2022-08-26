const OrganizationClientData = require('../../../core/client-data/organization');

const EventCompanyChange = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventCompanyChange.prototype.validate = function(){
    return true;
};

EventCompanyChange.prototype.process = function(){

    const sessionCompany = gd.session.companies.get(this.data.id);

    sessionCompany.set({
        name:       this.data.name,
        icon:       this.data.icon,
        settings:   this.data.settings ? OrganizationClientData.normalize(this.data.settings) : null,
        finance:    this.data.finance
    },{silent:false});
};


module.exports = EventCompanyChange;

