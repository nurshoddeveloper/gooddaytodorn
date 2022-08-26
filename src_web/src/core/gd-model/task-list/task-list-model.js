let AmpersandState = require('ampersand-state');
let Moment = require('moment');

let TaskModel = require('./task-model');
let ProjectModel = require('./project-model');

//let Users = require('../../../../core/gd-model/task/gd-task-users');
//let User = require('../../../../core/gd-model/user/gd-user-basic');

//let TaskStatusModel = require('../../../../core/gd-model/task-type/gd-task-status');
//let GroupStatusModel = require('../../../../core/gd-model/group-type/group-status-model');

let _ = require('lodash');

let ListItem = AmpersandState.extend({
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

        isSelected: {
            type: 'boolean',
            default: false
        },

        parentId: 'string',
        childrenItems: {
            type: 'array',
            default: ()=>{return []}
        },

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
        //console.log("TaskListModel _updateLastUpdateTime", this.getName(), this.lastUpdateTime);
    },

    onDataChanged(model) {
        const changed = model.changedAttributes();
        if ('lastUpdateTime' in changed) return;
        if ('parentId' in changed && Object.keys(changed).length === 1) return;

        //console.log("TaskListModel onDataChanged", this.getName(), model, model.changedAttributes());
        this._updateLastUpdateTime();
    },

    onItemDataChanged(model) {
        const changed = model.changedAttributes();
        if ('sortPosition' in changed && Object.keys(changed).length === 1) return;

        //console.log("TaskListModel onItemDataChanged", this.getName(), model, model.changedAttributes());
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

    update (data) {

        switch (this.type){
            case 'project':
                if (data.id) {
                    this.item.id = data.id;
                    this.id = 'p-'+data.id;
                }

                if (data.projectId) this.item.parentId = data.projectId;
                if (data.priority) this.item.priority = data.priority;
                if (data.sortPosition) this.item.sortPosition = data.sortPosition;

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
                // this.item.progress = data.progress;
                if (data.customFieldsData) this.item.customFieldsData = data.customFieldsData;

                if (data.actionRequiredUserId) this.item.actionRequiredUserId = data.actionRequiredUserId;
                if (data.systemStatus) this.item.systemStatus = data.systemStatus;
                if (data.statusId) this.item.taskStatusId = data.statusId;
                if (data.taskStatusId) this.item.taskStatusId = data.taskStatusId;

                if (data.sortPosition) this.item.sortPosition = data.sortPosition;
                break;
        }
    },

    changeParent(parentItem) {

        if (this.parentId) {
            let currentParent = this.collection.get(this.parentId);
            currentParent.removeChild(this.id);
        }

        if (parentItem){
            let newParent = this.collection.get(parentItem.id);
            newParent.addChild(this.id);

            this.parentId = parentItem.id;

            switch (parentItem.type){
                case "task":
                    //this.item.parentId = null;
                    this.item.parentTaskId = parentItem.item.id;
                    this.item.systemType = gd.const.taskSystemType.SUBTASK;
                    this.isCollapsed = true; //expand is not allowed for subtasks;
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

    setSystemStatus(status){
        switch (this.type){
            case 'project':
                this.item.systemStatus = status;
                break;
        }
    },

    setPriority(priorityValue, actionRequiredUserId) {
       this.item.priority = priorityValue;

       if (actionRequiredUserId) this.item.actionRequiredUserId = actionRequiredUserId;
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

    setSortPosition(sortPosition) {
        this.item.setSortPosition(sortPosition);
    },

    setIsSelected(val){
        this.isSelected = val;
    },

    getIsSelected() {
        return this.isSelected;
    },

    isAnyParentSelected() {
        let res = false;

        const _collection = this.collection;
        function collectParent(parentId) {
            if (parentId){
                const parent = _collection.get(parentId);
                if (parent){
                    if (parent.getIsSelected()) res = true;
                    collectParent(parent.parentId);
                }
            }
        }

        collectParent(this.parentId);

        return res;
    },

    countChildrenTasks() {
        let res = 0;
        this.childrenItems.map((childrenId) => {
            let child = this.collection.get(childrenId);
            res += (child.type === 'task' && child.display>0) ? 1 : 0;
            res += child.countChildrenTasks();
        });
        return res;
    },

    countChildrenProjects(openOnly) {
        let res = 0;
        this.childrenItems.map((childrenId) => {
            let child = this.collection.get(childrenId);

            let countCurrentChild = !(openOnly && !gd.const.systemStatus.isOpen(child.item.systemStatus));
            res += (child.type === "project" && child.display > 0 && countCurrentChild) ? 1 : 0;
            res += child.countChildrenProjects(openOnly);
        });
        return res;
    },

    countChildrenOpenTasks() {
        let res = 0;
        this.childrenItems.map((childrenId) => {
            let child = this.collection.get(childrenId);
            res += child.item.tasksOpen ? child.item.tasksOpen : 0;
            res += child.countChildrenOpenTasks();
        });
        return res;
    },

    countChildrenTotalTasks() {
        let res = 0;
        this.childrenItems.map((childrenId) => {
            let child = this.collection.get(childrenId);
            res += child.item.tasksTotal ? child.item.tasksTotal : 0;
            res += child.countChildrenTotalTasks();
        });
        return res;
    },

    countTimeReported() {
        let res = this.item.reportedTime ? this.item.reportedTime : 0;
        this.childrenItems.map((childrenId) => {
            let child = this.collection.get(childrenId);
            res += child.countTimeReported();
        });
        return res;
    },

    getAllChildrenIds() {
        const res = [];
        this.childrenItems.map((childrenId) => {
            const child = this.collection.get(childrenId);
            res.push(child.id);

            child.getAllChildrenIds().map(cId => { res.push(cId); });
        });
        return res;
    },

    getAllInvolvedUsersIds() {
        let res = [];
        if (this.type === "task") res = this.item.users.map(u=>u.userId);
        this.childrenItems.map((childrenId) => {
            const child = this.collection.get(childrenId);
            res = res.concat(child.getAllInvolvedUsersIds());
        });
        return res;
    },

    getProjectChildrenLevel(baseLevel = 1) {
        let res = baseLevel;
        if (this.childrenItems.length > 0) {
            let additionalLevel = 0;
            this.childrenItems.map((childrenId) => {
                const child = this.collection.get(childrenId);
                if (child.type === "project"){
                    additionalLevel = child.getProjectChildrenLevel(baseLevel + 1);
                    if (res < additionalLevel) res = additionalLevel;
                }
            });
        }
        return res;
    },

    getProjectChildren() {
        let res = [];
        if (this.childrenItems.length > 0) {
            this.childrenItems.map((childrenId) => {
                const child = this.collection.get(childrenId);
                if (child.type === "project"){
                    res.push(child);
                    res = res.concat(child.getProjectChildren());
                }
            });
        }
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

    getName() {
        switch (this.type){
            case "task": return this.item.title;
            case "project": return this.item.name;
        }
    },

    dndId() {
        return [this.id,this.item.systemType,this.parentId].join("_");
    },

    parse(obj) {
        let parent = null;
        if(obj.item && obj.item.cid) obj.item.off();

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

module.exports = ListItem;