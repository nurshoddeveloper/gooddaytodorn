var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    props: {
        id: 'string',
        companyId: 'string',
        systemStatus: 'number',
        name: 'string',
        color: 'number',
        description: 'string',
        isDeleted: {
            type: 'boolean',
            default: false
        }
    },

    parse: function(obj) {
        return obj;
    }
});