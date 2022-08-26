const EventActionProto = require('../event-action-proto');
const ProjectClientData = require('../../../core/client-data/project');

module.exports = class EventProjectsSettings extends EventActionProto {

    constructor(uid, data) {
        const restartApps = [];
        super(uid, data,restartApps);
    }

    validate() {
        return true;
    }

    process() {
        this.data.map(d=>{
            const sessionProject = gd.session.projects.get(d.id);

            if (sessionProject) {
                sessionProject.set({
                    settings: d.settings ? ProjectClientData.normalize(d.settings) : null
                },{silent:true});

                super.process();
            }
        });
    }
};