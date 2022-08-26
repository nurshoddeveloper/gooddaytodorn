const AmpersandStateExtended = require('../ampersand-state-extended');
const User = require('../user/gd-user-basic');
const Project = require('../project/gd-project');
const Moment = require('moment');

module.exports = AmpersandStateExtended.extend({
    idAttribute: 'id',
    props: {
        id: 'string',

        projectHistoryType: 'number',

        projectId: 'string',
        project: 'object',

        user: 'object',
        date: 'object',

        oldStatus: 'object',
        newStatus: 'object',

        oldProjectManager: 'object',
        newProjectManager: 'object',

        notes: 'string'

    },

    parse: function(obj) {

        obj.project = new Project(obj.project);

        obj.user = (obj.user)?new User(obj.user):null;

        obj.date = new Moment.utc(obj.date);

        return obj;
    }

});