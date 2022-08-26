var GDProjectGroups = require('../../gd-model/project-group/gd-project-groups');

var EventProjectGroupsReset = function(uid,data) {

    this.data = data;
    this.uid = uid;

};

EventProjectGroupsReset.prototype.validate = function(){

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

EventProjectGroupsReset.prototype.process = function(){

    //console.log("process EVENT project-groups-reset ",this.data);

    gd.session.projectGroups.reset(this.data);

    //console.log("B. ",gd.session.projectGroups);

};


module.exports = EventProjectGroupsReset;
