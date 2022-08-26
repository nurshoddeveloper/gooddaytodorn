var Event = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

Event.prototype.validate = function(){
    return true;
};

Event.prototype.process = function(){

    var companyId = this.data[0]['companyId'];

    gd.session.projectUsers.resetByCompany(companyId,this.data);
};

module.exports = Event;
