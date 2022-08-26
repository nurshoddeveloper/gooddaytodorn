var Event = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

Event.prototype.validate = function(){
    return true;
};

Event.prototype.process = function(){
    gd.session.projectUsers.reset(this.data,{parse:true});
};

module.exports = Event;
