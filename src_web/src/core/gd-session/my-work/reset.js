const _ = require('lodash');
const EventActionProto = require('../event-action-proto');
//const SessionLoader = require('../../gd/data/session-loader');

module.exports = class EventMyWorkReset extends EventActionProto {

    constructor(uid, data) {
        let restartApps = [];
        super(uid, data, restartApps);
    }

    validate() {
        return true;
    }

    // findMissingData() {
    //     if (!this.data) return false;
    //
    //     let allProjects = [];
    //     let allUsers = [];
    //     let allTaskTypes = [];
    //
    //     this.data.map(mw=>{
    //         const { fromUserId, report, task, event } = mw;
    //
    //         if (report) {
    //             const { reportUserId, reportProjectId } = report;
    //             if (reportUserId) allUsers.push(reportUserId);
    //             if (reportProjectId) allProjects.push(reportProjectId);
    //         }
    //
    //         if (task) {
    //             const { projectId, taskTypeId } = task;
    //             if (projectId) allProjects.push(projectId);
    //             if (taskTypeId) allTaskTypes.push(taskTypeId);
    //         }
    //
    //         if (event) {
    //             const { projectId } = event;
    //             if (projectId) allProjects.push(projectId);
    //         }
    //
    //         if (fromUserId) allUsers.push(fromUserId);
    //     });
    //
    //     return gd.session.findMissing({
    //         projects: _.uniq(allProjects),
    //         users: _.uniq(allUsers),
    //         taskTypes: _.uniq(allTaskTypes)
    //     });
    // }

    process() {

        // Seems like we dont' need it anymore
        // THIS IS A TEMP FIX >>>> proper will come eventualy where we get all reset data... and then do master check ... and load more only once
        // let sessionLoader = new SessionLoader();
        // sessionLoader.process(this.findMissingData());
        // sessionLoader.done(()=>{
        //     console.log(201,"my work sesson reset");
        //     gd.session.myWork.reset(this.data,{parse:true});
        //     gd.bus.triggerEvent(gd.const.busEvents.tasksListChange);
        // });

        gd.session.myWork.reset(this.data,{parse:true});
        gd.bus.triggerEvent(gd.const.busEvents.tasksListChange);



    }
};


