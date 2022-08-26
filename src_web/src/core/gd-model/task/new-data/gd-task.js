const AmpersandStateExtended = require('../../ampersand-state-extended');
const Moment = require('moment');

module.exports = AmpersandStateExtended.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        shortId: 'string',
        title: 'string',
        systemStatus: 'number',

        systemType: 'number', // 1 - is main task, 2 - is subtask
        parentTaskId: 'string', // not null for subtasks
        projectId: 'string', // not null for tasks in project

        priority: 'number',

        scheduleStatus: 'number',
        scheduleDate: 'gd-date',
        actionRequiredSinceDate: 'gd-datetime', // moment of latest AR change

        //project: 'object', projectId
        companyId: 'string',
        createdByUserId: 'string',
        createdForUserId: 'string',
        actionRequiredUserId: 'string',

        createdOnBehalfByUserId: 'string', // this is the user who "sent" task with latest AR change

        dateCreated: 'gd-datetime', //check in data
        latestActivityDate: 'gd-datetime',

        taskTypeId: 'string',
        taskStatusId: 'string',

        estimate: 'number', // in minutes
        completionDate: 'gd-datetime',
        deadline: 'gd-date', // Moment object

        customFieldsData: 'object',
        tags: 'array'
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
                const durationSeconds = Moment.utc().diff(this.actionPendingSince,'seconds');
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
        obj.dateCreated = Moment.utc(obj.dateCreated);
        if (obj.latestActivityDate) obj.latestActivityDate = Moment.utc(obj.latestActivityDate);

        return obj;
    },

    renderSchedule() {
        const { NOT_SCHEDULED, SCHEDULED, SOMEDAY } = gd.const.task.scheduleStatus;

        if (this.isOpen) {
            switch (this.scheduleStatus) {

                case NOT_SCHEDULED: return <div className="not-scheduled">Not scheduled</div>;

                case SCHEDULED:

                    let className = "schedule-date";
                    let label = this.scheduleDate.format("MMM D");

                    if (this.scheduleDate.isSame(Moment.utc(),'days')) {
                        label = 'Today';
                    }

                    if (this.scheduleDate.isBefore(Moment.utc(),'days')) {
                        className += " past";
                    }
                    return <div className={className}>{label}</div>;

                case SOMEDAY:       return <div className="not-scheduled">Someday</div>;
            }
        }
    }
});

