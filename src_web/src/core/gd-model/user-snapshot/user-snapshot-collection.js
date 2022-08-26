var AmpersandCollection = require('ampersand-collection');
var UserSnapshotModel = require('./user-snapshot-model');
var Moment = require('moment');

var UserSnapshotCollection = AmpersandCollection.extend({

    mainIndex: 'date',

    model: UserSnapshotModel,

    exportToChart(property){
        var out = {};
        this.map(function(model){
            out[model.date] = model[property];
        });
        return out;
    },

    filterByDates(startDate,endDate) {

        return new UserSnapshotCollection(this.filter(function(m){
            return (m.date>=startDate && m.date<=endDate)
        }));

    },

    calculateAverage(fieldName) {

        var totalRecords = this.length;

        var totalAmount = 0;

        this.map(function(m){
            totalAmount+=m[fieldName]
        });

        return Math.ceil(totalAmount/totalRecords);

    },

    exportOrganizationToChart(){
        return this.exportToChart('organization');
    },

    exportPlanningToChart(){
        return this.exportToChart('planning');
    },

    exportCommunicationToChart(){
        return this.exportToChart('communication');
    },

    exportTasks() {
        return this.exportToChart('tasksActive');
    },

    exportSomedayTasks() {
        return this.exportToChart('tasksSomeday');
    }

    //exportDailyBadges() {
    //    return this.exportToChart('dayResult');
    //}

});

module.exports = UserSnapshotCollection;