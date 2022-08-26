const AmpersandStateExtended = require('../ampersand-state-extended');

const Moment = require('moment');

module.exports = AmpersandStateExtended.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        name: 'string',
        systemStatus: 'number',
        priority: 'number',
        statusId: 'string',

        parentId: 'string', // not null if in project/folder
        companyId: 'string',

        momentCreated: 'gd-datetime',
        startDate: 'gd-date',
        endDate: 'gd-date',

        projectTypeId: 'string',
        systemType: 'number',

        statusComments: 'string',
        tasksOpen: 'number',
        tasksTotal: 'number',
        color: 'number',
        deadline: 'gd-date',
        estimate: 'number',

        users: 'array',

        access: 'number',
        sortPosition: 'number'
    },

    setSortPosition(sortPosition) {
        this.sortPosition = sortPosition;
    },

    parse(obj) {
        return obj;
    }
});

