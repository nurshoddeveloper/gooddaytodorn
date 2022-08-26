const AmpersandStateExtended = require('../../gd-model/ampersand-state-extended');

const GDTask = require('../task/gd-task');

const Moment = require('moment');
const DatetimeUtils = require('../../gd/utils/datetime-utils');

const MyWorkModel = AmpersandStateExtended.extend({

    idAttribute: 'id',

    props: {
        id: 'string',
        userId: 'string',
        type: 'number',

        fromUserId: 'string',
        projectId: 'string',
        companyId: 'string',

        task: 'object',
        event: 'object',
        report: 'object',
        reminder: 'object',

        dateCreated: 'gd-datetime',
        position: 'number',

        scheduleStatus: 'number',
        scheduleDate: 'gd-date',

        deadline: 'gd-date',
        startDate: 'gd-date',
        endDate: 'gd-date',

        isNew: 'boolean'
    },

    derived: {
        title: {
            deps: ['task', 'event','report'],
            fn: function () {
                if (this.task) return this.task.title;
                if (this.event) return this.event.title;
            }
        },
        folder: {
            deps: ['type', 'scheduleStatus', 'scheduleDate'],
            fn: function () {

                const { INBOX, SOMEDAY, PASTDUE, TODAY, DAY } = gd.const.myWork.group;
                const { NOT_SCHEDULED, SCHEDULED, SOMEDAY: SCHEDULED_SOMEDAY } = gd.const.task.scheduleStatus;

                if (this.scheduleStatus === NOT_SCHEDULED) return INBOX;

                if (this.scheduleStatus === SCHEDULED) {
                    const today = Moment();

                    switch (this.type) {
                        case gd.const.myWork.type.TASK:
                            const { deadline, endDate } = this.task;

                            /*if((deadline && Moment(deadline).isBefore(today,'day')) ||
                                (endDate && Moment(endDate).isBefore(today,'day')))
                                return TODAY; //PASTDUE;*/

                            if (this.scheduleDate.isSame(today,'day') || this.scheduleDate.isBefore(today,'day'))
                                return TODAY;
                            break;

                        default:
                            if (this.scheduleDate.isSame(today,'day') || this.scheduleDate.isBefore(today,'day')) return TODAY;
                            //if (this.scheduleDate.isBefore(today,'day')) return TODAY; //PASTDUE;
                            break;
                    }

                    // vse ostal'noe future
                    return DAY+this.scheduleDate.format("YYYY-MM-DD");
                }

                if (this.scheduleStatus === SCHEDULED_SOMEDAY) return SOMEDAY;
            }
        }

    },

    pastdueDays() {
        const { SCHEDULED } = gd.const.task.scheduleStatus;

        let res = 0;

        if (this.scheduleStatus === SCHEDULED) {
            const today = Moment();

            switch (this.type) {
                case gd.const.myWork.type.TASK:
                    const { deadline, endDate } = this.task;
                    if ((!!deadline && Moment(deadline).isBefore(today,'day'))) {
                        res = today.diff(Moment(deadline), 'days');
                    } else if (!!endDate && Moment(endDate).isBefore(today,'day')) {
                        res = today.diff(Moment(endDate), 'days');
                    } else if (this.scheduleDate.isBefore(today,'day')) {
                        res = today.diff(this.scheduleDate, 'days');
                    }
                    break;

                default:
                    res = this.scheduleDate.isBefore(today,'day') ? today.diff(this.scheduleDate, 'days') : 0;
                    break;
            }
        }

        return res;
    },

    reset(data) {
        switch (this.type) {
            case gd.const.myWork.type.TASK:
                this.task.priority =        data.task.priority;
                this.task.title =           data.task.title;
                this.task.taskTypeId =      data.task.taskTypeId;
                this.task.projectId =       data.task.projectId;
                this.task.deadline =        data.task.deadline;
                this.task.startDate =       data.task.startDate;
                this.task.endDate =         data.task.endDate;
                this.task.scheduleStatus =  data.task.scheduleStatus;
                this.task.scheduleDate =    data.task.scheduleDate;
                this.task.shortId =         data.task.shortId;

                this.set({
                    position:       data.position,
                    scheduleStatus: data.task.scheduleStatus,
                    scheduleDate:   data.task.scheduleStatus === gd.const.task.scheduleStatus.SCHEDULED ? DatetimeUtils.dateToMoment(data.task.scheduleDate) : null,
                    deadline:       data.task.deadline,
                    startDate:      data.task.startDate,
                    endDate:        data.task.endDate,
                    task:           this.task,
                    isNew:          data.isNew,
                },{silent:false});
                break;

            case gd.const.myWork.type.EVENT:
                this.set({
                    position: data.position,
                    scheduleDate: DatetimeUtils.dateToMoment(data.event.startDate),
                    event: data.event
                },{silent:false});
                break;

            case gd.const.myWork.type.REMINDER:
                this.set({
                    position: data.position,
                    scheduleDate: DatetimeUtils.datetimeToMoment(data.reminder.scheduleMoment), //!!! this should be date ???
                    reminder: data.reminder
                },{silent:false});
                break;

            default:
                console.error("my work reset unknown type");
                break;
        }
    },

    moveToFolder(folder){
        const { SOMEDAY, TODAY, DAY } = gd.const.myWork.group;

        if (this.folder === folder) return;

        switch (folder) {
            case TODAY:
                this.set({
                    scheduleStatus: 1,
                    scheduleDate: Moment(),
                    position: 0
                });
                break;
            case SOMEDAY:
                this.set({
                    scheduleStatus: 2,
                    scheduleDate: null,
                    position: 0
                });
                break;
            default:
                if (folder.substring(0, 4) === DAY) {
                    this.set({
                        scheduleStatus: 1,
                        scheduleDate: Moment(folder.substring(4)),
                        position: 0
                    });
                }
                break;
        }
    },
    
    getTask(){
        const { task, fromUserId, dateCreated } = this;

        return new GDTask({
            id: task.id,
            shortId: task.shortId,
            title: task.title,
            priority: task.priority,
            cameFromUser: gd.session.users.get(fromUserId),
            projectId: task.projectId,
            project: gd.session.projects.get(task.projectId),
            taskTypeId: task.taskTypeId,

            dateCreated: dateCreated,

            scheduleStatus: this.scheduleStatus,
            scheduleDate: this.scheduleDate
        },{parse:true});
    },

    parse(obj) {

        switch (obj.type) {

            case gd.const.myWork.type.TASK:
                obj.scheduleDate = obj.task.scheduleStatus === gd.const.task.scheduleStatus.SCHEDULED ? DatetimeUtils.dateToMoment(obj.task.scheduleDate) : null;
                obj.scheduleStatus = obj.task.scheduleStatus;
                obj.projectId = obj.task.projectId;
                obj.companyId = obj.task.companyId;

                obj.deadline = obj.task.deadline;
                obj.startDate = obj.task.startDate;
                obj.endDate = obj.task.endDate;
                break;

            case gd.const.myWork.type.EVENT:
                obj.scheduleDate = DatetimeUtils.dateToMoment(obj.event.startDate);
                obj.scheduleStatus = 1;
                obj.projectId = obj.event.projectId;
                break;

            case  gd.const.myWork.type.REPORT:
                obj.scheduleStatus = gd.const.task.scheduleStatus.NOT_SCHEDULED;
                break;

            case  gd.const.myWork.type.REMINDER:
                obj.scheduleDate = DatetimeUtils.datetimeToMoment(obj.reminder.scheduleMoment); // shoul be scheduleDate ???
                obj.scheduleStatus = obj.reminder.scheduleStatus;
                break;

            case  gd.const.myWork.type.RATE_EXPERIENCE:
                // obj.scheduleDate = null;
                obj.scheduleStatus = gd.const.task.scheduleStatus.NOT_SCHEDULED;
                break;

            default:
                console.error("unknown my work type");
        }

        return obj;
    }
});

module.exports = MyWorkModel;