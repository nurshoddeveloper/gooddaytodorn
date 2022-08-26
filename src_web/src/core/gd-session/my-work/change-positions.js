const EventMyWorkChangePositions = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventMyWorkChangePositions.prototype.validate = function(){
    return true;
};

EventMyWorkChangePositions.prototype.process = function(){
    const arrIds = this.data;

    let havePositionChanges = false;
    arrIds.forEach((id,key)=>{
        if (gd.session.myWork.get(id).position !== key+1) havePositionChanges = true;
    });

    if (!havePositionChanges) return;

    arrIds.forEach((id,key)=>{
        gd.session.myWork.get(id).set({position: key+1},{silent:true});
    });

    gd.session.myWork.trigger("reset");
    gd.bus.triggerEvent(gd.const.busEvents.tasksListChange);

    return true;
};


module.exports = EventMyWorkChangePositions;

