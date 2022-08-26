var EventDepartmentReset = function(uid,data) {

    this.data = data;
    this.uid = uid;

};

EventDepartmentReset.prototype.validate = function(){

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

EventDepartmentReset.prototype.process = function(){

    //console.log("process EVENT department-reset",this.data);

    gd.session.departments.reset(this.data);

    //console.log("B. ",gd.session.projectGroups);

};


module.exports = EventDepartmentReset;
