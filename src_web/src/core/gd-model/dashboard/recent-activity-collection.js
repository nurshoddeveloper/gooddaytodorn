var AmpersandCollection = require('ampersand-collection');
var ActivityModel = require('./recent-activity-model');
var _ = require('lodash');


var ActivitiesCollection = AmpersandCollection.extend({
    model: ActivityModel,

    groupByDay() {
        return _.chain(this.models)
            .groupBy(function(m){
                return m.date.format("YYYY-MM-DD");
            })
            .toPairs()
            .map(function(currentItem) {
                return _.fromPairs(_.zip(['date', 'activities'], currentItem));
            })
            .sortBy('date')
            .reverse()
            .value();
    }

});

module.exports = ActivitiesCollection;