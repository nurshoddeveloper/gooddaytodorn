import _ from "lodash";

const AmpersandState = require('ampersand-state');
const TaskStatusesCollection = require('./gd-task-statuses');
const React = require('react');

const GDTaskType = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        companyId: 'string',
        name: 'string',
        icon: 'string', // class name
        statuses: 'object',
        isDeleted: 'boolean',
        sortPosition: 'number',

        templateTitle: 'string',
        templateMessage: 'string',

        customFields: {
            type: 'array',
            default: ()=>[]
        },

        settings: 'object'
    },

    settingsNormalize(data) {
        const { ALLOWED, DENIED_ON_REPLY, ALWAYS_REQUIRED } = gd.const.taskTypeSettings.actionRequired;

        const actionRequired = (!data || ![ALLOWED, DENIED_ON_REPLY].includes(data.actionRequired)) ? ALLOWED : data.actionRequired;
        const isGeneric =  _.get(data,'isGeneric',false);
        const requiredFields = _.get(data,'requiredFields',[]);

        return {
            actionRequired: actionRequired,
            isGeneric: isGeneric,
            requiredFields: requiredFields
        }
    },

    parse(obj) {
        if (obj.statuses) {
            obj.statuses = new TaskStatusesCollection(obj.statuses, {parse: true});
        }

        obj.settings = this.settingsNormalize(obj.settings);

        return obj;
    },

    clone() {
        return new GDTaskType(this.toJSON());
    }
});

module.exports = GDTaskType;