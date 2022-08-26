const AmpersandState = require('ampersand-state');

const TaskModel = require('./task-model');
const ProjectModel = require('./project-model');

const Moment = require('moment');
const _ = require('lodash');

const GanttChartItemModel = AmpersandState.extend({
    idAttribute: 'id',

    props: {
        id: 'string',
        type: {
            type: 'string',
            values: ['task', 'project']
        },

        item: 'object',

        display: {
            type: 'number',
            default: 1  //// 1 - normal, display 2-ghost 0-none
        },

        isCollapsed: {
            type: 'boolean',
            default: true
        },

        parentId: 'string',
        childrenItems: {
            type: 'array',
            default: ()=>{return []}
        },

        sortPosition: 'number',

        lastUpdateTime: 'number'
    },

    derived: {
        companyId: {
            deps: ['item'],
            fn: function () {
                return this.item.companyId;
            }
        }
    },

    initialize() {
        this.on('change', this.onDataChanged);
    },

    _updateLastUpdateTime() {
        this.lastUpdateTime = Date.now();
        //console.log("GanttChartItemModel _updateLastUpdateTime", this.getName(), this.lastUpdateTime);
    },

    onDataChanged(model) {
        const changed = model.changedAttributes();
        if ('lastUpdateTime' in changed) return;
        if ('parentId' in changed && Object.keys(changed).length === 1) return;

        //console.log("GanttChartItemModel onDataChanged", this.getName(), model, model.changedAttributes());
        this._updateLastUpdateTime();
    },

    onItemDataChanged(model) {
        const changed = model.changedAttributes();
        if ('sortPosition' in changed && Object.keys(changed).length === 1) return;

        //console.log("GanttChartItemModel onItemDataChanged", this.getName(), model, model.changedAttributes());
        this._updateLastUpdateTime();
    },

    isOpen() {
        return gd.const.systemStatus.isOpen(this.item.systemStatus)
    },

    isClosed() {
        return gd.const.systemStatus.isClosed(this.item.systemStatus)
    },

    isParent(id) {
        let res = false;

        if (this.id === id) {
            res = true;
        } else {
            for (let i=0; i < this.childrenItems.length; i++){
                res = this.collection.get(this.childrenItems[i]).isParent(id);
                if (res) break;
            }
        }

        return res;
    },

    updateStartEndDates(newStartDate, newEndDate) {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;

        if (this.type === "task" || ![WORKFOLDER,BACKLOG].includes(this.item.systemType)) {
            this.item.startDate = newStartDate;
            this.item.endDate= newEndDate;
        }

        this.item.displayStartDate = newStartDate;
        this.item.displayEndDate= newEndDate;
    },

    update (data) {

        switch (this.type){
            case 'project':
                if (data.id) {
                    this.item.id = data.id;
                    this.id = 'p-'+data.id;
                }

                if (data.projectId) this.item.parentId = data.projectId;
                if (data.priority) this.item.priority = data.priority;
                if (data.access) this.item.access = data.access;
                break;

            case 'task':
                if (data.id) {
                    this.item.id = data.id;
                    this.id = 't-'+data.id;
                }

                if (data.shortId) this.item.shortId = data.shortId;
                if (data.parentTaskId) this.item.parentTaskId = data.parentTaskId;
                if (data.projectId) this.item.parentId = data.projectId;
                if (data.statusProjectId) this.item.statusProjectId = data.statusProjectId;

                if (data.priority) this.item.priority = data.priority;
                break;
        }
    },

    setAR(actionRequiredUserId){
        switch (this.type){
            case 'project':
                break;

            case 'task':
                this.item.setAR(actionRequiredUserId);
                break;
        }
    },

    setAssignedToUser(assignedToUserId) {
        switch (this.type){
            case 'project':
                break;

            case 'task':
                this.item.setAssignedToUser(assignedToUserId);
                break;
        }
    },

    setPriority(priorityValue, actionRequiredUserId) {
        this.item.priority = priorityValue;

        if (actionRequiredUserId) this.item.actionRequiredUserId = actionRequiredUserId;
    },

    setSystemStatus(status){
        switch (this.type){
            case 'project':
                this.item.systemStatus = status;
                break;
        }
    },

    changeParent(parentItem) {

        if (this.parentId) {
            const currentParent = this.collection.get(this.parentId);
            currentParent.removeChild(this.id);
        }

        if (parentItem){
            const newParent = this.collection.get(parentItem.id);
            newParent.addChild(this.id);

            this.parentId = parentItem.id;

            switch (parentItem.type){
                case "task":
                    this.item.parentId = null;
                    this.item.parentTaskId = parentItem.item.id;
                    this.item.systemType = gd.const.taskSystemType.SUBTASK;
                    break;

                case "project":
                    this.item.parentId = parentItem.item.id;

                    if (this.type === 'task'){
                        this.item.parentTaskId = null;
                        this.item.systemType = gd.const.taskSystemType.TASK;
                    }
                    break;
            }
        } else {
            //move to root
            this.parentId = null;
            this.item.parentId = null;

            if (this.type === 'task'){
                this.item.parentTaskId = null;
                this.item.systemType = gd.const.taskSystemType.TASK;
            }
        }
    },

    removeChild(childId) {
        _.remove(this.childrenItems, (ci) => ci === childId);
    },

    addChild(childId) {
        this.childrenItems.push(childId);
    },

    countChildrenTasks() {
        let res = 0;
        this.childrenItems.map((childrenId) => {
            const child = this.collection.get(childrenId);
            res += (child.type === 'task' && child.display>0) ? 1 : 0;
            res += child.countChildrenTasks();
        });
        return res;
    },

    setStatus(statusId, actionRequiredUserId){
        let status = gd.session.statuses.get(statusId);
        this.item.systemStatus = status.systemStatus;
        this.item.statusId = statusId;

        switch (this.type){
            case 'project':
                break;

            case 'task':
                if (gd.const.systemStatus.isClosed(this.item.systemStatus))
                    this.item.actionRequiredUserId = null;
                else if (actionRequiredUserId)
                    this.item.actionRequiredUserId = actionRequiredUserId;
                break;
        }
    },

    getName() {
        switch (this.type){
            case "task": return this.item.title;
            case "project": return this.item.name;
        }
    },

    getAllChildrenTasks() {
        const res = [];
        this.childrenItems.map((childrenId) => {
            const child = this.collection.get(childrenId);
            if (child.type === 'task' && child.display>0) res.push(child);

            child.getAllChildrenTasks().map(c=>{res.push(c);});
        });
        return res;
    },

    getAllChildren() {
        const res = [];
        this.childrenItems.map((childrenId) => {
            const child = this.collection.get(childrenId);
            if (child.display>0) res.push(child);

            child.getAllChildren().map(c => {res.push(c);});
        });
        return res;
    },

    getAllParents() {
        const res = [];

        const _collection = this.collection;
        function collectParent(parentId) {
            if (parentId){
                const parent = _collection.get(parentId);
                if (parent){
                    res.push(parent);
                    collectParent(parent.parentId);
                }
            }
        }

        collectParent(this.parentId);
        return res;
    },

    getEarliestStartMoment() {
        // const { SOMEDAY } = gd.const.task.scheduleStatus;

        let startMoment = null;

        const includeAllChildren = this.type === "project" || this.display > 0;

        const updateStartMoment = (item)=>{
            const { startDate, scheduleDate/*, scheduleStatus*/ } = item;
            const start = startDate ? startDate : scheduleDate ? scheduleDate : null;

            if (start /*&& scheduleStatus !== SOMEDAY*/ && includeAllChildren && (!startMoment || startMoment.isAfter(Moment(start)))) {
                startMoment = Moment(start);
            }
        };

        updateStartMoment(this.item);

        this.childrenItems.map((childrenId) => {
            const child = this.collection.get(childrenId);
            updateStartMoment(child);

            const childMoment = child.getEarliestStartMoment();
            if (childMoment && includeAllChildren && (!startMoment || startMoment.isAfter(childMoment))) {
                startMoment = Moment(childMoment);
            }
        });
        return startMoment;
    },

    getDisplayStartEndDate() {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;
        const { displayStartDate, displayEndDate, scheduleDate } = this.item;

        let start = displayStartDate ? displayStartDate : scheduleDate ? scheduleDate : null;

        const _collection = this.collection;
        const collectFromParent = (parentId)=>{
            if (parentId){
                const parent = _collection.get(parentId);
                if (parent) {
                    if (parent.item.displayStartDate) start = parent.item.displayStartDate;
                    if (!start) collectFromParent(parent.parentId);
                }
            }
        };

        if (this.type === "project" && [WORKFOLDER,BACKLOG].includes(this.item.systemType)) {
            if (!start) collectFromParent(this.parentId);
        }

        return {
            displayStartDate: start,
            displayEndDate: displayEndDate ? displayEndDate : start
        };
    },

    getStartEnd() {
        const { displayStartDate, displayEndDate } = this.item;

        return {
            start: displayStartDate,
            end: displayEndDate,
            days: (displayStartDate && displayEndDate) ? (displayEndDate.diff(displayStartDate, 'days') + 1) : 1
        }
    },

    getChildrenStartEnd() {
        let start, end;

        this.getAllChildren().map((c,key)=>{
            const { displayStartDate, displayEndDate } = c.item;
            if (!start || displayStartDate.isBefore(start,'day')) start = displayStartDate;
            if (!end || displayEndDate.isAfter(end,'day')) end = displayEndDate;
        });

        return {
            start: start ? start : Moment(Moment().format("YYYY-MM-DD")),
            end: end ? end : Moment(Moment().format("YYYY-MM-DD")),
            minDays: (start && end) ? (end.diff(start, 'days') + 1) : 1
        }
    },

    getItemPlanningExtend() {
        const today = Moment(Moment().format("YYYY-MM-DD"));
        const { startDate, endDate, displayStartDate, displayEndDate } = this.item;

        const start = startDate ? startDate : today;
        const end = endDate ? endDate : start;
        const displayStart = displayStartDate ? displayStartDate : today;
        const displayEnd = displayEndDate ? displayEndDate : displayStart;

        const startDiff = start.diff(displayStart, 'days');
        const endDiff = displayEnd.diff(end, 'days');

        return {
            startDiff: startDiff,
            endDiff: endDiff
        }
    },

    getDuration(ignoreWeekends) {
        const { startDate, endDate, systemType } = this.item;
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;

        const { displayStartDate, displayEndDate } = this.getDisplayStartEndDate();
        const weekdays = ignoreWeekends ? [1,2,3,4,5] : [1,2,3,4,5,6,7];

        let daysDiff = 0;
        if ([WORKFOLDER, BACKLOG].includes(systemType)) {
            if (displayEndDate) daysDiff = gd.utils.numberOfWeekdaysBetween(displayStartDate, displayEndDate, weekdays);
        } else {
            if (endDate) daysDiff = gd.utils.numberOfWeekdaysBetween(startDate, endDate, weekdays);
        }

        return daysDiff;
    },

    getDurationStart(ignoreWeekends) {
        const { startDate, systemType } = this.item;
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;
        const { displayStartDate } = this.getDisplayStartEndDate();

        let res;
        if ([WORKFOLDER, BACKLOG].includes(systemType)) {
            res = displayStartDate ? displayStartDate : Moment(Moment().format("YYYY-MM-DD"));
        } else {
            res = startDate ? startDate : Moment(Moment().format("YYYY-MM-DD"));
        }

        return res;
    },

    parse(obj) {

        let parent = null;

        switch (obj.type) {
            case 'project':
                obj.item = new ProjectModel(obj.item,{parse:true});
                obj.id = 'p-'+obj.item.id;

                if (obj.item.parentId) parent="p-"+obj.item.parentId;
                break;

            case 'task':
                obj.item = new TaskModel(obj.item,{parse:true});
                obj.id = 't-'+obj.item.id;

                if (obj.item.parentTaskId) parent="t-"+obj.item.parentTaskId;
                else if (obj.item.parentId) parent="p-"+obj.item.parentId;
                break;
        }

        obj.parentId = parent;

        obj.item.on('change', this.onItemDataChanged.bind(this));

        this._updateLastUpdateTime();

        return obj;
    }
});

module.exports = GanttChartItemModel;