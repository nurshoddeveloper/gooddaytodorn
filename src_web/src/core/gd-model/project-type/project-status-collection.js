var _ = require('lodash');
var AmpersandCollection = require('ampersand-collection');
var ProjectStatusModel = require('./project-status-model');


module.exports = AmpersandCollection.extend({
    model: ProjectStatusModel,

    comparator: function(m) {
        if (m.status) {
            return m.systemStatus*100+m.sortPosition;
        } else {
            return m.sortPosition;
        }
    },

    findBySystemStatus: function(arrStatuses) {
        return this.models.filter(function(s){
            return _.indexOf(arrStatuses,s.status.systemStatus)>-1;
        })
    },

    exportToOptions: function() {

        return this.map(function(m){
            return {
                value: m.status.id,
                label: m.status.name,
                color: m.status.color
            }
        });
    }

});