var TaskModel = require('../task/task-basic');
var TaskType = require('../task-type/gd-task-type');
var ProjectBasicModel = require('../project/project-basic');

module.exports = TaskModel.extend({
    idAttribute: 'id',
    props: {
        taskType: 'object'
    },
    children: {
        project: ProjectBasicModel
    }
});