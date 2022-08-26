const AmpersandStateExtended = require('../ampersand-state-extended');

const WorkScheduleAccessCollection = AmpersandStateExtended.extend({
    idAttribute: 'id:',

    props: {
        id: 'string',

        momentCreated: 'gd-date',
        userId: 'string',
        targetUserId: 'string',
        companyId: 'string',
    },

    parse(obj) {

        obj.id = obj.companyId + "_" + obj.userId + "_" + obj.targetUserId;

        return obj;
    }
});

module.exports = WorkScheduleAccessCollection;