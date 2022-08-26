const AmpersandModel = require('ampersand-model');
const ProjectStatusCollection = require('./project-status-collection');


module.exports = AmpersandModel.extend({
    props: {
        id: 'string',
        companyId: 'string',
        systemType: 'number',
        name: 'string',
        isDeleted: {
            type: 'boolean',
            default: false
        },
        statuses: 'object'
    },
    parse: function(obj) {
        if (obj.statuses) {
            obj.statuses = new ProjectStatusCollection(obj.statuses,{parse:true});
            obj.statuses.sort();
        }
        return obj;
    }
});