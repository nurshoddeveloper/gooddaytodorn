var EventProjectGroupsResetByCompany = function(uid,data) {

    this.data = data;
    this.uid = uid;

};

EventProjectGroupsResetByCompany.prototype.validate = function(){

    //console.log("EVENT projects-reset validate ",this.data);

    return true;

    //if (
    //    this.data.id === undefined ||
    //    this.data.name === undefined ||
    //    this.data.icon === undefined ||
    //    this.data.status === undefined ||
    //    this.data.companyId === undefined ||
    //    this.data.role === undefined
    //) {
    //    return false
    //} else {
    //    return true;
    //}
};

EventProjectGroupsResetByCompany.prototype.process = function(){

    //console.log("process EVENT project-groups-reset ",this.data);

    var companyId = this.data[0].companyId;

    gd.session.projectGroups.resetByCompany(companyId,this.data);

    //console.log("B. ",gd.session.projectGroups);

};


module.exports = EventProjectGroupsResetByCompany;
