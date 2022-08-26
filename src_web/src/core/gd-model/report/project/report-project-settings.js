var AmpersandState = require('ampersand-state');
var ProjectModel = require('../../project/project-basic');
var Moment = require('moment');

module.exports = AmpersandState.extend({
    idAttribute: 'projectId',
    props: {

        isEnabled: 'boolean',
        nextReportDate: 'object',
        duration: 'number',
        notificationUsers: 'array'
    },

    children: {
        project: ProjectModel
    },

    derived: {
        projectId: {
            deps: ['project'],
            fn: function() {
                return this.project.id;
            }
        }
    },

    parse(obj) {

        obj.nextReportDate=(obj.nextReportDate)?Moment.utc(obj.nextReportDate).local():null;

        return obj;
    }
});