const AmpersandStateExtended = require('../ampersand-state-extended');
const Project = require('../project/gd-project');
const Company = require('../company/company-basic');
const UserBasicModel = require('../user/gd-user-basic');
const Moment = require('moment');
const StatusModel = require('../status/status-model');
const TaskType = require('../task-type/gd-task-type');

const GDTask = AmpersandStateExtended.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        shortId: 'string',
        title: 'string',
        systemStatus: 'number',

        systemType: 'number', // 1 - is main task, 2 - is subtask
        parentTaskId: 'string', // not null for subtasks
        parentGroupId: 'string', // not null for tasks in group

        priority: 'number',

        scheduleStatus: 'number',
        scheduleDate: 'gd-date',
        actionPendingSince: 'gd-datetime', // moment of latest AR change *old... to be raplaced with arSinceDate
        actionRequiredSinceDate: 'gd-datetime', // moment of latest AR change

        project: 'object',
        projectId: 'string',

        company: 'object',
        createdByUser: 'object',
        createdForUser: 'object',
        actionRequiredUser: 'object',
        cameFromUser: 'object', // this is the user who "sent" task with latest AR change
        dateCreated: 'gd-datetime',
        recentActivity: 'gd-datetime',

        taskType: 'object',
        taskTypeId: 'string',

        taskStatus: 'object',

        estimate: 'number', // in minutes
        completionDate: 'gd-datetime',
        deadline: 'gd-date', // Moment object

        customFieldsData: 'object'
    },

    derived: {
        url: {
            deps: ['id'],
            fn: function () {
                return "t/" + this.id;
            }
        },
        lifeTime: {
            deps: ['dateCreated'],
            fn: function () {
                const durationSeconds = Moment().diff(this.dateCreated,'seconds');
                return Moment.duration(durationSeconds, 'seconds');
            }
        },
        lifeTimeFilter: {
            deps: ['dateCreated'],
            fn: function () {
                const durationSeconds = Moment().diff(this.dateCreated,'seconds');
                const duration = Moment.duration(durationSeconds, 'seconds');

                if (duration.months()<1)
                {
                    // weeks
                    if (duration.days()>28) {
                        return "4 weeks +";
                    } else if (duration.days()>21) {
                        return "3 weeks +";
                    } else if (duration.days()>14) {
                        return "2 weeks +"
                    } else if (duration.days()>7) {
                        return "1 week +"
                    } else {
                        return "Less than a week";
                    }
                } else {
                    // month
                    if (duration.months() === 1) {
                        return "1 month +";
                    } else {
                        return duration.months()+" months +";
                    }
                }

            }
        },
        recentActivityFilter: {
            deps: ['recentActivity'],
            fn: function () {
                const durationSeconds = Moment().diff(this.recentActivity,'seconds');
                const duration = Moment.duration(durationSeconds, 'seconds');

                if (duration.months()<1)
                {
                    // weeks
                    if (duration.days()>28) {
                        return "4 weeks +";
                    } else if (duration.days()>21) {
                        return "3 weeks +";
                    } else if (duration.days()>14) {
                        return "2 weeks +"
                    } else if (duration.days()>7) {
                        return "1 week +"
                    } else {
                        // days
                        if (duration.days()<1) {
                            return "Today";
                        } else if (duration.days()<2) {
                            return "Yesterday";
                        } else {
                            return duration.days()+" days";
                        }
                    }
                } else {
                    // month
                    if (duration.months() === 1) {
                        return "1 month +";
                    } else {
                        return duration.months()+" months +";
                    }
                }

            }
        },
        actionPendingSinceFilter: {
            deps: ['actionPendingSince'],
            fn: function () {
                const durationSeconds = Moment().diff(this.actionPendingSince,'seconds');
                const duration = Moment.duration(durationSeconds, 'seconds');

                if (duration.months()<1)
                {
                    // weeks
                    if (duration.days()>28) {
                        return "4 weeks +";
                    } else if (duration.days()>21) {
                        return "3 weeks +";
                    } else if (duration.days()>14) {
                        return "2 weeks +"
                    } else if (duration.days()>7) {
                        return "1 week +"
                    } else {
                        // days
                        if (duration.days()<1) {
                            return "Less than a day";
                        } else if (duration.days()<2) {
                            return "1 day";
                        } else {
                            return duration.days()+" days";
                        }
                    }
                } else {
                    // month
                    if (duration.months() === 1) {
                        return "1 month +";
                    } else {
                        return duration.months()+" months +";
                    }
                }

            }
        },

        isOpen: {
            deps: ['systemStatus'],
            fn: function () {
                return (gd.const.systemStatus.isOpen(this.systemStatus));
            }
        }
    },

    parse(obj) {

        obj.project = new Project(obj.project);
        obj.company = new Company(obj.company);
        obj.createdByUser = new UserBasicModel(obj.createdByUser);
        obj.createdForUser = new UserBasicModel(obj.createdForUser);

        obj.actionRequiredUser = (obj.actionRequiredUser && obj.actionRequiredUser.id)?new UserBasicModel(obj.actionRequiredUser):null;

        // obj.dateCreated = DatetimeUtils.datetimeToMoment(obj.dateCreated);
        // obj.recentActivity = DatetimeUtils.datetimeToMoment(obj.recentActivity);
        // obj.scheduleDate = DatetimeUtils.dateToMoment(obj.scheduleDate);

        // obj.actionPendingSince = DatetimeUtils.datetimeToMoment(obj.actionPendingSince);
        // obj.actionRequiredSinceDate = DatetimeUtils.datetimeToMoment(obj.actionRequiredSinceDate);
        // obj.completionDate = DatetimeUtils.datetimeToMoment(obj.completionDate);

        // obj.deadline = DatetimeUtils.dateToMoment(obj.deadline);

        obj.taskType = (obj.taskType)?new TaskType(obj.taskType,{parse:true}):null;
        obj.taskStatus = (obj.taskStatus)?new StatusModel(obj.taskStatus,{parse:true}):null;
        obj.cameFromUser = (obj.cameFromUser)?new UserBasicModel(obj.cameFromUser):null;

        return obj;
    },

    renderSchedule: function() {
        if (this.isOpen) {
            switch (this.scheduleStatus) {
                case 0:
                    return (
                        <div className="not-scheduled">Not scheduled</div>
                    );
                    break;
                case 1:

                    let className = "schedule-date";
                    let label = this.scheduleDate.format("MMM D");

                    if (this.scheduleDate.isSame(Moment(),'days')) {
                        label = 'Today';
                    }

                    if (this.scheduleDate.isBefore(Moment(),'days')) {
                        className += " past";
                    }
                    return (
                        <div className={className}>{label}</div>
                    );
                    break;
                case 2:
                    return (
                        <div className="not-scheduled">Someday</div>
                    );
                    break;
            }
        }
    }
});

module.exports = GDTask;

