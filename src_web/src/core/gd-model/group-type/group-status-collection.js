var _ = require('lodash');
var AmpersandCollection = require('ampersand-collection');
var GroupStatusModel = require('./group-status-model');


module.exports = AmpersandCollection.extend({
    model: GroupStatusModel,

    comparator: function(m) {
        if (m.status) {
            return m.systemStatus*100+m.sortPosition;
        } else {
            return m.sortPosition;
        }
    },

    getByStatusId(statusId) {
        let res;
        this.models.map(function(s){
            if (s.status.id == statusId){
                res = s;
                return false;
            }
        });
        return res;
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