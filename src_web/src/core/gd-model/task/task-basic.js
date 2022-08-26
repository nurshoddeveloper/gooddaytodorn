const AmpersandStateExtended = require('../ampersand-state-extended');

module.exports = AmpersandStateExtended.extend({

    idAttribute: 'id',

    props: {
        id: 'string',
        shortId: 'string',
        title: 'string'
    },

    derived: {
        url: {
            deps: ['id'],
            fn: function () {
                return "t/" + this.id;
            }
        }

    }
});