const EventActionProto = require('../event-action-proto');

module.exports = class EventProjectDelete extends EventActionProto {

    constructor(uid, data) {
        let restartApps = [];
        super(uid, data, restartApps);
    }

    process() {
        const projectId = this.data.id;
        let companyId = null;

        // remove project from templates
        const sessionTemplate = gd.session.templatesList.get(projectId);
        if (sessionTemplate) {
            gd.session.templatesList.remove(sessionTemplate);
            companyId = sessionTemplate.companyId;
        }

        // remove project from projects
        const sessionProject = gd.session.projects.get(projectId);
        if (sessionProject) {
            gd.session.projects.remove(sessionProject);
            companyId = sessionProject.companyId;
        }

        // kill dashboard tiles
        let dashboardTilesToRemove = gd.session.dashboard.filter(m=>{
            return m.tileType === gd.const.dashboard.type.PROJECT && m.target === projectId;
        });
        dashboardTilesToRemove.map(tile=>{
            gd.session.dashboard.remove(tile);
        });

        // remove all the notifications
        gd.session.updates.deleteAllByProject(projectId);

        // don't get how companyId can be null but had error in Sentry like https://sentry.io/goodday/goodday-client-app/issues/667800218/?query=is:unresolved
        // this session event is sent to all users in company even if they didn't have this project
        /*if (!companyId) {
            gd.utils.captureErrorMessage('no project->company in delete project session event', {
                level: 'error', // one of 'info', 'warning', or 'error'
                extra: {
                    user: gd.session.me.id,
                    sessionTemplate: sessionTemplate,
                    sessionProject: sessionProject,
                    data: this.data,
                    dataJsonData: JSON.stringify(this.data)
                }
            });
        }*/

        // let's recreate the tree ?
        if (gd.tree && companyId) { // there is a chance when there is no tree when new user creates new company (!) so we skip it in here!
            gd.tree.resetCompanyProjects(companyId);
        }

        super.process();
    }
};

