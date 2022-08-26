var EventDepartmentResetByCompany = function(uid,data) {

    this.data = data;
    this.uid = uid;

};

EventDepartmentResetByCompany.prototype.validate = function(){

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

EventDepartmentResetByCompany.prototype.process = function(){

    //console.log("process EVENT department-reset-by-company",this.data);

    var companyId = this.data[0].companyId;

    gd.session.departments.resetByCompany(companyId,this.data);

    //console.log("B. ",gd.session.projectGroups);

};


module.exports = EventDepartmentResetByCompany;
