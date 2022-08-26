var AmpersandModel = require('ampersand-model');
var Moment = require('moment');

module.exports = AmpersandModel.extend({
    props: {
        date: 'string',

        dayResult: 'number',
        organization: 'number',
        planning: 'number',
        communication: 'number',

        tasksOpen: 'number',
        tasksReview: 'number',
        tasksSomeday: 'number'
    },


    derived: {
        tasksActive: {
            deps: ['tasksOpen', 'tasksReview'],
            fn: function () {
                return this.tasksOpen + this.tasksReview;
            }
        },
        moment: {
            deps: ['date'],
            fn: function () {
                return Moment(new Date(this.date))
            }
        }
    },

    parse: function(obj) {
        return obj;
    }
});