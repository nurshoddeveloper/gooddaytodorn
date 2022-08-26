const EventTaskReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventTaskReset.prototype.validate = function(){
    return true;
};

EventTaskReset.prototype.process = function(){


  if (gdConfig.nativeApp) {
    window.reduxActions && window.reduxActions.receiveTaskGdSession(this.data);
    gd.bus.triggerEvent(gd.const.busEvents.tasksListChange);
    return;
  }

    if (gd.appTask && gd.layout.task.isOpen) {

        // make sure we are updating only if we are viwing this task
        if (gd.appTask.taskId === this.data.id) {
            gd.appTask.sessionTaskReset(this.data);
        }

        // restart main (background) application
        if (gd.app) {

            if (gd.app.onTaskUpdatedInTaskView) {
                gd.app.onTaskUpdatedInTaskView(this.data);
            } else {
                // if no related metod found just restart app...
                gd.app.start();
            }


        }

    }




    // below is old !
    // const app = gd.getApp();
    //
    // if (app.name) {
    //     if (app.name === 'task-view') {
    //         app.setTask(this.data);
    //     }
    // }
    //
    // gd.bus.triggerEvent(gd.const.busEvents.tasksListChange);
};

module.exports = EventTaskReset;
