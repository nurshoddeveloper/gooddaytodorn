var EventTaskTypeReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventTaskTypeReset.prototype.validate = function(){
    return true;
};

EventTaskTypeReset.prototype.process = function(){
    gd.session.taskTypes.reset(this.data,{parse:true});
};


module.exports = EventTaskTypeReset;
