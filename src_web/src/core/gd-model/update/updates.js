const AmpersandCollection = require('ampersand-collection');
const UpdateModel = require('./update');

const _ = require('lodash');

const Updates = AmpersandCollection.extend({
    model: UpdateModel,

    findUsersFilterValues() {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return [];

        let result = {};

        this.models.forEach(m=>{
            const { fromUserId } = m.taskMessage;
            if(fromUserId) {
                const user = gd.session.users.get(fromUserId);
                if (user) {
                    if (!result[fromUserId]) {
                        result[fromUserId] = {
                            counter: 0,
                            item: user
                        };
                    }

                    result[fromUserId]['counter']++;
                }
            }
        });

        return _.sortBy(result,'counter');
    },

    findProjectFilterValues() {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return [];

        let result = {};

        this.models.forEach(m=>{
            const { projectId } = m.task;
            if (!result[projectId]) {
                result[projectId] = {
                    counter: 0,
                    item: gd.session.projects.get(projectId)
                };
            }

            result[projectId]['counter']++;
        });

        return _.sortBy(result,'counter');
    },

    filterActualUpdates() {
        //filter out updates of unavailable (deleted) projects
        return new Updates(this.filter(m=>!!gd.session.projects.get(m.task.projectId)),{parse:false});
    },

    getImportantUpdates() {
        return this.filter(m=>{
            const threshold = gd.session.companies.get(m.companyId).priorities.length > 2 ? 6 : 50;
            return m.task.priority >= threshold
                || gd.session.starredItems.isTaskIn(m.task.id)
                || gd.session.starredItems.isProjectIn(m.task.projectId);
        });
    },

    deleteAllByProject(projectId) {
        const modelsToDelete = this.filter(m=>{
            const projects = [projectId].concat(gd.tree.findProjectChildren(projectId).map(p=>p.id));
            return projects.includes(m.task.projectId);
        });

        if (modelsToDelete) {
            modelsToDelete.map(model=>{
                this.remove(model);
            })
        }
    }
});

module.exports = Updates;