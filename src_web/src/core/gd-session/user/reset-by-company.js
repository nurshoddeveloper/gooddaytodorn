var EventUsersResetByCompany = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventUsersResetByCompany.prototype.validate = function(){
    return true;
};

EventUsersResetByCompany.prototype.process = function(){
    var companyId = this.data[0].companyId;
    gd.session.users.resetByCompany(companyId,this.data);
};

module.exports = EventUsersResetByCompany;
