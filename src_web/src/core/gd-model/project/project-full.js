const GDProjectModel = require('./gd-project');
const ProjectUsersFull = require('../project-user/project-user-collection-full');
const Moment = require('moment');

const ProjectFull = GDProjectModel.extend({
    idAttribute: "id",
    props: {
        priority: 'number',

        keywords: 'string',

        systemType: 'number',
        statusId: 'string',
        systemStatus: 'number',

        projectTypeId: 'string',

        // company: 'object',

        statusComments: 'string',
        dateCreated: 'object',
        users: 'object',
        defaultUserRole: 'number',
        deadline: 'object',
        startDate: 'object',
        endDate: 'object',

        description: 'string',
        defaultView: 'string'
    },
    parse: function(obj){
        // if (obj.company) obj.company = new Company(obj.company); - old
        // obj.status = (obj.status)?new StatusModel(obj.status):null; - remov old

        if (obj.dateCreated) obj.dateCreated = Moment(obj.dateCreated);
        if (obj.users) obj.users = new ProjectUsersFull(obj.users,{parse: true});
        obj.deadline = (obj.deadline)?Moment(obj.deadline):null;
        obj.startDate = (obj.startDate)?Moment(obj.startDate):null;
        obj.endDate = (obj.endDate)?Moment(obj.endDate):null;

        return obj;
    }
});

module.exports = ProjectFull;
