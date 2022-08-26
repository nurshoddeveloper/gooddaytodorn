const MyWorkModel = require('../../gd-model/my-work/my-work-model');

const EventMyWorkNew = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventMyWorkNew.prototype.validate = function(){
    return true;
};

EventMyWorkNew.prototype.process = function(){
    const newModel = new MyWorkModel(this.data,{parse:true});
    gd.session.myWork.add(newModel,{
        silent:false
    });
    gd.bus.triggerEvent(gd.const.busEvents.tasksListNew);
};

module.exports = EventMyWorkNew;

