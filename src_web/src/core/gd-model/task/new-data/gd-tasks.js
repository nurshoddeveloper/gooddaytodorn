const AmpersandCollection = require('ampersand-collection');
const GDTask = require('./gd-task');

const _ = require('lodash');

const GDTasks = AmpersandCollection.extend({
    model: GDTask,

    initialize(models) {
    },

    findUsersFilterValues() {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return [];

        let result = {};

        this.models.forEach(m=>{
            const { createdByUserId } = m;
            if(createdByUserId) {
                const user = gd.session.users.get(createdByUserId);
                if (user) {
                    if (!result[createdByUserId]) {
                        result[createdByUserId] = {
                            counter: 0,
                            item: user
                        };
                    }

                    result[createdByUserId]['counter']++;
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
            if(projectId) {
                if (!result[projectId]) {
                    result[projectId] = {
                        counter: 0,
                        item: gd.session.projects.get(projectId)
                    };
                }

                result[projectId]['counter']++;
            }
        });

        return _.sortBy(result,'counter');
    }
});

module.exports = GDTasks;