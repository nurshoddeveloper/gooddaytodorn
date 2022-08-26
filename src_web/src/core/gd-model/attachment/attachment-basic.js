var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    props: {
        id: 'string',
        storageProvider: 'number',
        fileType: 'number',
        isFlagged: 'boolean',
        fileId: 'string',
        name: 'string',
        size: 'number',
        preview: 'number',
        mime: 'string'
    },
    parse: function(obj) {
        return obj;
    }
});