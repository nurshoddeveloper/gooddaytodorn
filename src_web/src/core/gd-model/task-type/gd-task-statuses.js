const AmpersandCollection = require('ampersand-collection');
const Status = require('./gd-task-status');
const _ = require('lodash');

const StatusesCollection = AmpersandCollection.extend({
    model: Status,

    comparator(m) {
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

    filterOpenStatuses() {
        var filteredModels = this.filter(function(model){
            return gd.const.systemStatus.isOpen(model.systemStatus);
        });
        return new StatusesCollection(filteredModels);
    },

    exportToOptions: function() {

        return this.map(function(taskStatus){
            return {
                value: taskStatus.status.id,
                label: taskStatus.status.name,
                //colorClass: 'status-color-'+taskStatus.status.color,
                color: taskStatus.status.color,
                systemStatus: taskStatus.status.systemStatus
            }
        })
    }

});

module.exports = StatusesCollection;