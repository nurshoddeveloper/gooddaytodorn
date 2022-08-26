var EventUserInvitationsReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventUserInvitationsReset.prototype.validate = function(){
    return true;
};

EventUserInvitationsReset.prototype.process = function(){
    gd.session.invitations.reset(this.data,{parse:true});
};

module.exports = EventUserInvitationsReset;
