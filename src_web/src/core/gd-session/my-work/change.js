const Moment = require('moment');

const EventMyWorkChange = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventMyWorkChange.prototype.validate = function(){
    return true;
};

EventMyWorkChange.prototype.process = function(){
    try {
        const myWork = gd.session.myWork.get(this.data.id);

        if (myWork) {
            myWork.reset(this.data);
            gd.session.myWork.trigger("reset");
            gd.session.myWork.folder(myWork.folder).trigger("reset");
            gd.bus.triggerEvent(gd.const.busEvents.tasksListChange);
        }
    } catch(err) {
        gd.utils.captureErrorMessage('EventMyWorkChange error', {
            level: 'error', // one of 'info', 'warning', or 'error'
            extra: {
                this: this,
                error: err
            }
        });
    }
};


module.exports = EventMyWorkChange;

