let AmpersandState = require('ampersand-state');

let TaskType = require('../task-type/gd-task-type');

let GDHierarchyItem = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        parentId: 'string',

        systemStatus: 'number',
        systemType: 'number',
        taskType: 'object',
        title: 'string',

        statusId: 'string',

        isCollapsed: {
            type: 'boolean',
            default: true
        },

        childrenItems: {
            type: 'array',
            default: ()=>{return []}
        }
    },

    countChildrenTasks() {
        let res = 0;
        this.childrenItems.map((childrenId) => {
            let child = this.collection.get(childrenId);
            res += (child.systemType == gd.const.taskSystemType.TASK) ? 1 : 0;
            res += child.countChildrenTasks();
        });
        return res;
    },

    parse: function(obj) {

        if (obj.taskType) obj.taskType = new TaskType(obj.taskType,{parse:true});

        return obj;
    }
});

module.exports = GDHierarchyItem;