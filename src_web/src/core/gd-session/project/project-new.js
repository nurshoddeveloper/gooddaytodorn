const EventActionProto = require('../event-action-proto');
const ProjectModel = require('../../gd-model/project/project-model-session');
const SessionLoader = require('../../../../src_web_changed/core/gd/data/session-loader');

module.exports = class EventProjectNew extends EventActionProto {

    constructor(uid, data) {
        const restartApps = [];
        super(uid, data,restartApps);
    }

    process() {

        if (this.data.isTemplate && !this.data.parentId) {
            const newTemplateModel = new ProjectModel(this.data, {parse:true});
            gd.session.templatesList.add(newTemplateModel);
        }

        const newModel = new ProjectModel(this.data, {parse:true});
        gd.session.projects.add(newModel);

        let statuses = newModel.taskStatusesOverride ? newModel.taskStatusesOverride : [];
        let sessionLoader = new SessionLoader();
        sessionLoader.process(gd.session.findMissing({
            statuses: statuses
        }));

        if (!newModel.isTemplate && gd.tree) { // there is a chance when there is no tree when new user creates new company (!) so we skip it in here!
            gd.tree.resetCompanyProjects(newModel.companyId);
        }
    }
};