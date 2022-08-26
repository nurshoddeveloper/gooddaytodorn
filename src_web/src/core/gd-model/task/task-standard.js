const TaskBasicModel = require('./task-basic');
const TaskTypeModel = require('../task-type/gd-task-type');
const ProjectBasicModel = require('../project/project-basic');

module.exports = TaskBasicModel.extend({

    props: {
        priority: 'object',
        projectId: 'string',
        taskTypeId: 'string'
    },

    children: {
        taskType: TaskTypeModel,
        project: ProjectBasicModel
    }


});