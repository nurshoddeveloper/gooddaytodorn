var AmpersandModel = require('ampersand-model');
var GroupStatusCollection = require('./group-status-collection');

module.exports = AmpersandModel.extend({
    props: {
        id: 'string',
        companyId: 'string',
        name: 'string',
        isDeleted: {
            type: 'boolean',
            default: false
        },
        statuses: 'object'
    },
    parse: function(obj) {
        if (obj.statuses) {
            obj.statuses = new GroupStatusCollection(obj.statuses,{parse:true});
            obj.statuses.sort();
        }
        return obj;
    }
});