const AmpersandState = require('ampersand-state');
const TaskType = require('../task-type/gd-task-type');


const ProjectBasicModel = require('../project/project-basic');
const TaskBasicModel = require('../task/task-basic');

const Task = TaskBasicModel.extend({
    idAttribute: 'id',
    props: {
        icon: 'string',
        systemStatus: 'number',
        project: 'object'
        // projectId: 'string'
    },

    // children: {
    //     project: ProjectBasicModel
    // },

    parse: function(obj) {
        return obj;
    }
});

module.exports = Task;