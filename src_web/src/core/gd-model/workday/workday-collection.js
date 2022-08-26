var AmpersandCollection = require('ampersand-collection');
var WorkdayModel = require('./workday-model');

module.exports = AmpersandCollection.extend({
    model: WorkdayModel,

    mainIndex: 'date',

    calculateTotalMinutes() {
        var total = 0;
        this.map(function(m){
            if (m.minutes) total+=m.minutes;
        });
        return total;
    }

});