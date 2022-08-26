var debug = false;

var EventCompanyUserChange = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventCompanyUserChange.prototype.validate = function(){
    return true;
};

EventCompanyUserChange.prototype.process = function(){

    if (debug) {
        console.log("event {EventUserChange}");
        console.log("companyId",this.data.companyId);
        console.log("userId",this.data.userId);
        console.log("companyRole",this.data.companyRole);
        console.log("departmentId",this.data.departmentId);
        //console.groupEnd();
    }

    var id = this.data.companyId+"-"+this.data.userId;
    var user = gd.session.companyUsers.get(id);

    user.set({
        companyRole: this.data.companyRole,
        departmentId: this.data.departmentId
    },{silent:false});

    if (debug) {
        console.log("Session user = ",user);
        //console.groupEnd();
    }
};


module.exports = EventCompanyUserChange;