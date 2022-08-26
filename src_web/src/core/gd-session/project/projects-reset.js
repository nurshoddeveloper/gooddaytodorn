const SessionLoader = require('../../../../src_web_changed/core/gd/data/session-loader');

const EventProjectsReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventProjectsReset.prototype.validate = function(){
    return true;
};

EventProjectsReset.prototype.process = function(){

    const projectsToUpdateSettings = [];
    let statuses = [];
    gd.session.projects.map(p=>{
        if (p.settings) projectsToUpdateSettings.push(p.id);
        if (p.taskStatusesOverride) statuses = statuses.concat(p.taskStatusesOverride);
    });

    gd.session.projects.reset(this.data, {parse:true});
    gd.session.templatesList.reset(this.data ? this.data.filter(m=>m.isTemplate && !m.parentId) : [], {parse:true});

    let sessionLoader = new SessionLoader();
    sessionLoader.process(gd.session.findMissing({
        projectsSettings: projectsToUpdateSettings,
        statuses: statuses
    }));

    sessionLoader.done(()=>{
        gd.tree.companies.map(company=>{
            gd.tree.resetCompanyProjects(company.id);
        });
    })
};


module.exports = EventProjectsReset;
