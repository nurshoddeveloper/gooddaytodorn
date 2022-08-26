var AmpersandModel = require('ampersand-model');
var Moment = require('moment');

var DotsItem = AmpersandModel.extend({
    props: {
        moment: 'object',
        completed: 'number',
        commented: 'number',
        users: 'object'
    },

    derived: {

    },

    parse(obj) {
        obj.moment = obj.moment?Moment(obj.moment):null;
        return obj;
    }

});

module.exports = DotsItem