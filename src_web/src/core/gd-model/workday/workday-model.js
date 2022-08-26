var Moment = require('moment');
var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
    props: {
        date: 'string',
        minutes: 'number'
    },

    derived: {
        moment: {
            deps: ['date'],
            fn: function () {
                return new Moment(this.date);
            }
        }
    }

    //parse(obj) {
    //    obj.moment = Moment(obj.date);
    //    return obj;
    //}
});