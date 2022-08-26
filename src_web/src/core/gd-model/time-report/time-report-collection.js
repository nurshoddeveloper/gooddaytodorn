const _ = require('lodash');
const AmpersandCollection = require('ampersand-collection');
const TimeReportModel = require('./time-report-model');

module.exports = AmpersandCollection.extend({
    model: TimeReportModel,

    mainIndex: 'id',

    findProjects() {

        let projectIds = [];

        this.map(function(m){
            projectIds.push(m.task.projectId);
        });

        projectIds = _.uniq(projectIds);

        return projectIds.map(projectId=>{
            return gd.session.projects.get(projectId);
        });
    },

    findTasksByDate(moment) {
        return this.filter(function(m){
            return m.date.isSame(moment,'day')
        }).map(function(r){
            return r.task;
        })
    },

    calculateTotalMinutes(moment) {
        var reportedMinutes = 0;
        var estimatedMinutes = 0;

        this.map(function(r){
            if (r.reportedMinutes) reportedMinutes+=r.reportedMinutes;
            if (r.estimatedMinutes) estimatedMinutes+=r.estimatedMinutes;
        });

        return {
            reportedMinutes: reportedMinutes,
            estimatedMinutes: estimatedMinutes
        }
    },

    calculateTotalMinutesByDate(moment) {
        var reportedMinutes = 0;
        var estimatedMinutes = 0;

        this.filter(function(m){
            return m.date.isSame(moment,'day')
        }).map(function(r){
            if (r.reportedMinutes) reportedMinutes+=r.reportedMinutes;
            if (r.estimatedMinutes) estimatedMinutes+=r.estimatedMinutes;
        });

        return {
            reportedMinutes: reportedMinutes,
            estimatedMinutes: estimatedMinutes
        }
    },

    groupByTask() {
        var groupped = _.chain(this.models)
            .groupBy(function(m){
                return m.task.id;
            })
            .toPairs()
            .map(function(currentItem) {
                var estimatedMinutes = 0;
                var reportedMinutes = 0;

                currentItem[1].map(function(r){
                    if (r.estimatedMinutes) estimatedMinutes+=r.estimatedMinutes;
                    if (r.reportedMinutes) reportedMinutes+=r.reportedMinutes;
                });

                return {
                    task: currentItem[1][0].task,
                    estimatedMinutes: estimatedMinutes,
                    reportedMinutes: reportedMinutes,
                    totalMinutes: estimatedMinutes+reportedMinutes
                };
            })
            .sortBy('totalMinutes')
            .value()
            .reverse();

        return groupped;
    }

});