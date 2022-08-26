const EventActionProto = require('../event-action-proto');

module.exports = class EventProjectUsersResetByProject extends EventActionProto {

    constructor(uid, data) {
        const restartApps = [];
        super(uid, data,restartApps);
    }

    validate() {
        return true;
    }

    process() {
        if (this.data) {

            const { projectId } = this.data[0];
            const project = gd.session.projects.get(projectId);

            if (!project) {
                //this event is passed to every user in company, backend makes no
                //difference even if user is not supposed to get this event

                /*gd.utils.captureErrorMessage('EventProjectUsersResetByProject - no project found', {
                    level: 'error', // one of 'info', 'warning', or 'error'
                    extra: {
                        projectId: projectId,
                        data: this.data,
                        dataJsonData: JSON.stringify(this.data)
                    }
                });*/
                return;
            }

            /*this.data.map(d=>{
                const { userId, access } = d;
                if (gd.session.me.id === userId && project.access !== access) {
                    project.access = access;
                }
            });*/

            // console.log("EventProjectUsersResetByProject process", this.data);

            gd.session.projectUsers.resetByProject(projectId,this.data);
            super.process();
        }
    }


};