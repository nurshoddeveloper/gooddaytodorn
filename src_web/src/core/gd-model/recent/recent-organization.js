const AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    idAttribute: 'organizationId',

    props: {
        organizationId: 'string',
        counter: {
            type: 'number',
            default: 0
        }
    },

    localStorageFormat: function() {
        return this.organizationId + "-" + this.counter;
    }


});