var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
    props: {
        id: 'string',
        statusId: 'string',
        status: 'object',
        sortPosition: 'number',
        projectTypeId: 'string' // ??? nobody needs it ?
    },

    derived: {
        systemStatus: {
            deps: ['statusId,status'],
            fn: function () {
                return (this.status)?this.status.systemStatus:null;
            }
        }
    },

    parse: function(obj) {
        if (obj.statusId) {
            obj.status = gd.session.statuses.get(obj.statusId);
        }
        return obj;
    }
});