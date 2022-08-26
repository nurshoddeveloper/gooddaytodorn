const AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({

    idAttribute: 'id',

    props: {
        id: 'string',
        companyId: 'string',
        name: 'string',
        boardType: 'number',
        isPinned: 'boolean',
        settings: 'object',
    },

    derived: {
        url: {
            deps: ['id','boardType'],
            fn: function() {
                return "v/"+gd.const.views[this.boardType].url+'/'+this.id;
            }
        }
    },

    parse: function(obj) {
        return obj;
    }

});