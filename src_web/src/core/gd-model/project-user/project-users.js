const AmpersandCollection = require('ampersand-collection');
const ProjectUser = require('./project-user-basic');
const _ = require('lodash');

const ProjectUsers = AmpersandCollection.extend({
    model: ProjectUser,

    countByProject(projectId) {

        return this.filter(m=>m.project.id === projectId).length;

    },

    getByProject(projectId) {
        return this.filter(m=>m.project.id === projectId).map(pu=>pu.user.id);
    },

    filterByProject(projectId) {
        return new ProjectUsers(this.filter(m=>m.project.id === projectId),{parse:false});
    },

    filterByProjects(projectIds) {
        return new ProjectUsers(this.filter(m => projectIds.indexOf(m.project.id) > -1), {parse:false});
    },

    filterByUser(userId) {
        return new ProjectUsers(this.filter(m=>m.user.id === userId),{parse:false});
    },

    findProjectManager() {
        let pu = false;
        this.models.map(m=>{
            if (m.projectRole === gd.const.project.role.PROJECT_MANAGER) {
                pu = m;
            }
        });
        return pu;
    },

    findProjectOwner() {
        let po = false;
        this.models.map(m=>{
            if (m.projectRole === gd.const.project.role.OWNER) {
                po = m;
            }
        });
        return po;
    },

    exportToOptions() {
        const result = [];
        this.models.map(m=>{
            result.push({
                value: m.user.id,
                label: m.user.name,
                icon: m.user.icon,
                iconObj: m.user
            })
        });

        return result;
    },

    resetByProject(projectId,data) {
        const oldUsersArr = this.filter(projectUser=>projectUser.project.id === projectId);
        _.each(oldUsersArr,model=>{this.remove(model,{ silent: true })});

        //temporary fix to remove users for projects not present in gd.session.projects - THIS IS NEED FIX as pu relays on project model...
        const newData = _.remove(data.slice(), data=>gd.session.projects.get(data.projectId) != null);
        this.add(newData,{ parse: true, silent: true });
        this.trigger("reset");
    },

    resetByCompany(companyId,newData) {
        const oldUsersArr = this.filter(projectUser=>projectUser.project.companyId === companyId);
        _.each(oldUsersArr,model=>{this.remove(model,{ silent: true })});

        //temporary fix to remove users for projects not present in gd.session.projects
        newData = _.remove(newData, data=>gd.session.projects.get(data.projectId) != null);

        this.add(newData,{ parse: true, silent: true });
        this.trigger("reset");
    },

    findByProjectAndUser(projectId, userId) {

        var result = null;

        this.map(function(projectUser){
            if (projectUser.user.id === userId && projectUser.project.id === projectId) {
                result = projectUser;
                return false;
            }
        });

        return result;
    }

});

module.exports = ProjectUsers;