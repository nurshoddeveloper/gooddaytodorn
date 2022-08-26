const EventUpdateCounter = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventUpdateCounter.prototype.validate = function(){
    return true;
};

EventUpdateCounter.prototype.process = function(){
    gd.session.counters.setNotificationsCount(this.data.updates);
};

module.exports = EventUpdateCounter;
