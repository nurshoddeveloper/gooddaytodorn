const AmpersandState = require('ampersand-state');

const RecentTaskModel = AmpersandState.extend({
    idAttribute: 'taskId',
    props: {
        taskId: 'string',
        date: 'object',

        title: 'string',
        taskTypeId: 'string',
        projectId: 'string',
        actionRequiredUserId: 'string',
        systemStatus: 'number'
    },

    setData(data){
        if (data.title) this.title = data.title;
        if (data.taskTypeId) this.taskTypeId = data.taskTypeId;
        if (data.projectId) this.projectId = data.projectId;
        if (data.actionRequiredUserId) this.actionRequiredUserId = data.actionRequiredUserId;
        if (data.systemStatus) this.systemStatus = data.systemStatus;
    },

    getTask(){
        const { taskId, date, title, taskTypeId, projectId, actionRequiredUserId, systemStatus } = this;

        return {
            id: taskId,
            date: date,
            title: title,
            taskTypeId: taskTypeId,
            projectId: projectId,
            actionRequiredUserId: actionRequiredUserId,
            systemStatus: systemStatus
        }
    },

    localStorageFormat() {
        return this.taskId+"-"+this.date.format('X');
    }
});

module.exports = RecentTaskModel;