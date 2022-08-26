const TaskBasic = require('../task/task-basic');
const TaskType = require('../task-type/gd-task-type');

module.exports = TaskBasic.extend({
    props: {
        taskType: 'object',
        priority: 'number'
    },
    parse: function(obj){

        TaskBasic.prototype.parse.apply(this,[obj]);

        obj.taskType = (obj.taskType)?new TaskType(obj.taskType):null;

        return obj;
    }
});
