const TaskBasicModel = require('../task/task-basic');

const _ = require('lodash');

const TaskModel = TaskBasicModel.extend({

    props: {
        systemStatus: 'number',

        systemType: 'number', // 1 - is main task, 2 - is subtask
        parentTaskId: 'string', // not null for subtasks
        parentId: 'string', // not null for tasks in projects/folders
        statusProjectId: 'string', //for project statuses override while in tag (parentId is overwritten to null)

        priority: 'number',

        scheduleStatus: 'number',
        scheduleDate: 'gd-date',

        deadline: 'gd-date',
        estimate: 'number',
        progress: 'number',

        //projectId: 'string',
        companyId: 'string',

        createdByUserId: 'string',
        createdForUserId: 'string',
        actionRequiredUserId: 'string',
        assignedToUserId: 'string',

        momentCreated: 'gd-datetime',
        recentActivityMoment: 'gd-datetime',
        //actionRequiredSinceMoment: 'object', // moment of latest AR change

        taskTypeId: 'string',
        statusId: 'string',

        startDate: 'gd-date',
        endDate: 'gd-date',

        users: 'array',

        customFieldsData: 'object',
        tags: 'array',

        reportedTime: 'number',
        sortPosition: 'number',
        recurrency: 'object'
    },

    derived: {
        isOpen: {
            deps: ['systemStatus'],
            fn: function(){
                return gd.const.systemStatus.isOpen(this.systemStatus)
            }
        }
    },

    setAR(id) {
        const curAR = _.find(this.users, u=>u.id === this.actionRequiredUserId);
        if (curAR) curAR.taskRole = gd.const.task.role.COLLABORATOR;

        this.actionRequiredUserId = id;
        this.scheduleStatus = gd.const.task.scheduleStatus.NOT_SCHEDULED;
        this.scheduleDate = null;

        // id can be empty!
        if (id && !_.find(this.users, u=>u.userId === id))
            this.users.unshift({ taskRole: gd.const.task.role.ASSIGNEE, userId: id });
    },

    setAssignedToUser(id) {
        const curAssignedToUser = _.find(this.users, u=>u.id === this.assignedToUserId);
        if (curAssignedToUser) curAssignedToUser.taskRole = gd.const.task.role.COLLABORATOR;

        this.assignedToUserId = id;

        // id can be empty!
        if (id && !_.find(this.users, u=>u.userId === id))
            this.users.unshift({ taskRole: gd.const.task.role.COLLABORATOR, userId: id });
    },

    setSortPosition(sortPosition) {
        this.sortPosition = sortPosition;
    },

    parse(obj) {
        //created by can be empty - mom task
        if (!obj.users) obj.users = [];
        let createdByUser = _.find(obj.users, u=> u.taskRole === gd.const.task.role.CREATOR);
        obj.createdByUserId = createdByUser ? createdByUser.userId : obj.createdByUserId;

        if (!obj.customFieldsData) obj.customFieldsData = {};
        if (obj.projectId) obj.parentId = obj.projectId;

        return obj;
    }
});

module.exports = TaskModel;

