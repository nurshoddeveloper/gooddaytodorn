const EventCompaniesReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventCompaniesReset.prototype.validate = function(){
    return true;
};

EventCompaniesReset.prototype.process = function(){
    //const raw = this.data.slice(0);

    gd.session.companies.reset(this.data,{parse:true});
    gd.session.companies.sort();
    gd.session.recent.organizations.reInit();

    gd.initCurOrganizationId();

    //gd.tree related
    const treeCompanies = [];
    this.data && this.data.map(company=>{
        treeCompanies.push({
            accountType: company.accountType,
            icon: company.icon,
            id: company.id,
            isAdmin: company.isAdmin,
            name: company.name,
            role: company.role
            //finance? do we need it here ?
        });
    });

    gd.tree.reset(treeCompanies);

    gd.bus.triggerEvent("companies-reset");

    let liveSupportEnabled = true;
    this.data && this.data.map(company=>{
        if (!company.liveSupport) {
            liveSupportEnabled = false
        }
    });

    if (gd.liveSupport) {
        gd.liveSupport.setIsEnabledForCurrentUser(liveSupportEnabled);
    }

};

module.exports = EventCompaniesReset;