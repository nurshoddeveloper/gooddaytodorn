const AmpersandCollection = require('ampersand-collection');
const ActivityModel = require('./activity');

const _ = require('lodash');

const Activities = AmpersandCollection.extend({
    model: ActivityModel,

    findUsersFilterValues() {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return [];

        let result = {};

        this.models.forEach(m=>{
            const { userId } = m;
            if(userId) {
                const user = gd.session.users.get(userId);
                if (user) {
                    if (!result[userId]) {
                        result[userId] = {
                            counter: 0,
                            item: user
                        };
                    }

                    result[userId]['counter']++;
                }
            }
        });

        return _.sortBy(result,'counter');
    },

    findProjectFilterValues() {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return [];

        let result = {};

        this.models.forEach(m=>{
            const { projectId } = m;
            const project = gd.session.projects.get(projectId);
            if (project) {
                if (!result[projectId]) {
                    result[projectId] = {
                        counter: 0,
                        item: project
                    };
                }

                result[projectId]['counter']++;
            }
        });

        return _.sortBy(result,'counter');
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

module.exports = Activities;