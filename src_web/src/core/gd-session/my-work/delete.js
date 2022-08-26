const EventMyWorkDelete = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventMyWorkDelete.prototype.validate = function(){
    return true;
};

EventMyWorkDelete.prototype.process = function(){
    try {
        const myWork = gd.session.myWork.get(this.data.id);
        gd.session.myWork.remove(myWork);
        gd.bus.triggerEvent(gd.const.busEvents.tasksListDelete);
    } catch(err) {
        gd.utils.captureErrorMessage('EventMyWorkDelete error', {
            level: 'error', // one of 'info', 'warning', or 'error'
            extra: {
                this: this,
                error: err
            }
        });
    }

};

module.exports = EventMyWorkDelete;

