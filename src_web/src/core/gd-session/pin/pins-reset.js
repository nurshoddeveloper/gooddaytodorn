const EventPinsReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventPinsReset.prototype.validate = function(){
    return true;
};

EventPinsReset.prototype.process = function(){
    gd.session.pins.reset(this.data,{parse:true});
};


module.exports = EventPinsReset;
