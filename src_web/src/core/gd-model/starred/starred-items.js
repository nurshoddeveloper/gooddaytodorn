const AmpersandCollection = require('ampersand-collection');

const ModelStarredItem = require('./starred-item');

const _ = require('lodash');

const StarredItems = AmpersandCollection.extend({
    model: ModelStarredItem,

    isTaskIn(taskId) {
        return _.find(this.models, i=>i.taskId === taskId);
    },

    isProjectIn(projectId) {
        return _.find(this.models, i=>i.projectId === projectId);
    },

    findByValue(taskId,projectId) {
        let res = false;

        if (taskId) {
            res = this.models.filter(i=>i.taskId === taskId);
            if (res) return res[0];
        }

        if (projectId) {
            res = this.models.filter(i=>i.projectId === projectId);
            if (res) return res[0];
        }

    }
});

module.exports = StarredItems;