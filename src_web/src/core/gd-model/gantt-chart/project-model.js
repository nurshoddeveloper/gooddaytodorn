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
        displayStartDate: 'gd-date',
        displayEndDate: 'gd-date',
        deadline: 'gd-date',

        projectTypeId: 'string',
        systemType: 'number',
        access: 'number',

        dependsOn: {
            type: 'array',
            default: ()=>{return []}
        }
    },

    parse(obj) {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG} = gd.const.project.type;

        if (![WORKFOLDER, BACKLOG].includes(obj.systemType)) {
            obj.displayStartDate = obj.displayStartDate ? obj.displayStartDate : obj.startDate ? obj.startDate : null;
            obj.displayEndDate = obj.displayEndDate ? obj.displayEndDate : obj.endDate ? obj.endDate : null;
        } else {
            obj.startDate = null;
            obj.endDate = null;
        }

        return obj;
    }
});

