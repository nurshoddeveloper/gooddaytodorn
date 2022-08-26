let AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        name: 'string',
        systemStatus: 'number',
        parentGroupId: 'string', // not null if in group
        priority: 'number',
        status: 'object',
    },

    parse: function(obj) {

        return obj;
    }
});

