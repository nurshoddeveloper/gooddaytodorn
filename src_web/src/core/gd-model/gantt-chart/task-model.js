const TaskBasicModel = require('../task/task-basic');

// const Moment = require('moment');
const _ = require('lodash');

const GanttTaskModel = TaskBasicModel.extend({

    props: {
        systemStatus: 'number',

        systemType: 'number', // 1 - is main task, 2 - is subtask
        parentTaskId: 'string', // not null for subtasks
        parentId: 'string', // not null for tasks in projects/folders
        statusProjectId: 'string', //for project statuses override while in tag (parentId is overwritten to null)

        priority: 'number',
        progress: 'number',

        scheduleStatus: 'number',
        scheduleDate: 'gd-date',

        projectId: 'string',
        companyId: 'string',

        createdByUserId: 'string',
        createdForUserId: 'string',
        assignedToUserId: 'string',
        actionRequiredUserId: 'string',

        momentCreated: 'gd-datetime',
        recentActivityMoment: 'gd-datetime',

        taskTypeId: 'string',
        statusId: 'string',

        users: 'array',

        startDate: 'gd-date',
        endDate: 'gd-date',
        displayStartDate: 'gd-date',
        displayEndDate: 'gd-date',
        deadline: 'gd-date',

        estimate: 'number',
        recurrency: 'object',

        dependsOn: {
            type: 'array',
            default: ()=>{return []}
        }
    },

    derived: {
        isOpen: {
            deps: ['systemStatus'],
            fn: function () {
                return (gd.const.systemStatus.isOpen(this.systemStatus));
            }
        }
    },

    setAR(id) {
        const curAR = _.find(this.users, u=>u.id === this.actionRequiredUserId);
        if (curAR) curAR.taskRole = gd.const.task.role.COLLABORATOR;

        this.actionRequiredUserId = id;
        this.scheduleStatus = gd.const.task.scheduleStatus.NOT_SCHEDULED;
        this.scheduleDate = null;

        // id can be null
        if (id && !_.find(this.users, u=>u.userId === id))
            this.users.unshift({ taskRole: gd.const.task.role.ASSIGNEE, userId: id });
    },

    setAssignedToUser(id) {
        const curAssignedToUser = _.find(this.users, u=>u.id === this.assignedToUserId);
        if (curAssignedToUser) curAssignedToUser.taskRole = gd.const.task.role.COLLABORATOR;

        this.assignedToUserId = id;

        // id can be null
        if (id && !_.find(this.users, u=>u.userId === id))
            this.users.unshift({ taskRole: gd.const.task.role.COLLABORATOR, userId: id });
    },

    parse(obj) {

        //created by can be empty - mom task
        let createdByUser = _.find(obj.users, u=> u.taskRole === gd.const.task.role.CREATOR);
        obj.createdByUserId = createdByUser ? createdByUser.userId : null;

        // obj.momentCreated = obj.momentCreated ? Moment.utc(obj.momentCreated).local() : null;
        // obj.recentActivityMoment = obj.recentActivityMoment ? Moment.utc(obj.recentActivityMoment).local() : null;

        // obj.scheduleMoment = obj.scheduleMoment ? Moment.utc(obj.scheduleMoment).local() : null;
        // obj.startDate = obj.startDate ? Moment(obj.startDate) : null;  // not UTC because it is date
        // obj.endDate = obj.endDate ? Moment(obj.endDate) : null;  // not UTC because it is date

        if (obj.projectId) obj.parentId = obj.projectId;

        obj.displayStartDate = obj.displayStartDate ? obj.displayStartDate : obj.startDate ? obj.startDate : null;
        obj.displayEndDate = obj.displayEndDate ? obj.displayEndDate : obj.endDate ? obj.endDate : null;

        return obj;
    }

});

module.exports = GanttTaskModel;

