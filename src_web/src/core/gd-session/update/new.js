const UpdateModel = require('../../gd-model/update/update');

const EventUpdateNew = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventUpdateNew.prototype.validate = function(){
    return true;
};

EventUpdateNew.prototype.process = function(){
    const newModel = new UpdateModel(this.data,{parse:true});
    if (gd.session.updates.length > 0) gd.session.updates.add(newModel,{silent:false});
    gd.session.counters.increaseNotificationsCount();
};

module.exports = EventUpdateNew;
