const AmpersandCollection = require('ampersand-collection');
const ProjectUserModelFull = require('./project-user-model-full');

const ProjectUsersFull = AmpersandCollection.extend({
    model: ProjectUserModelFull,

    initialize: function (models) {},

    exportToOptions: function() {
        const result = [];
        this.models.map(function(m){
            result.push({
                value: m.user.id,
                label: m.user.name,
                icon: m.user.icon,
                iconObj: m.user
            })
        });

        return result;
    },

    findProjectManager: function() {
        let pu = false;
        this.models.map(function(m){
            if (m.projectRole === gd.const.project.role.PROJECT_MANAGER) {
                pu = m;
            }
        });
        return pu;
    },

    findProjectOwner: function() {
        let po = false;
        this.models.map(function(m){
            if (m.projectRole === gd.const.project.role.OWNER) {
                po = m;
            }
        });
        return po;
    },

    findLimitedAccessUsers: function() {
        return this.filter(function(m){
            return (m.access==gd.const.project.access.LIMITED);
        })
    },
    findStandardAccessUsers: function() {
        return this.filter(function(m){
            return (m.access==gd.const.project.access.STANDARD);
        })
    },
    findFullAccessUsers: function() {
        return this.filter(function(m){
            return (m.access==gd.const.project.access.FULL);
        })
    },

    filterByFunction(func) {
        return new ProjectUsersFull(this.filter(function(m){
            return func(m);
        }));
    }
});

module.exports = ProjectUsersFull;