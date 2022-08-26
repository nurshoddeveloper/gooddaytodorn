let AmpersandState = require('ampersand-state');

let ProjectModel = require('./hierarchy-project-model');
let TaskModel = require('./hierarchy-task-model');

let GDHierarchyItem = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        type: {
            type: 'string',
            values: ['project', 'task']
        },

        item: 'object',

        parentId: 'string',
        childrenItems: {
            type: 'array',
            default: ()=>{return []}
        }
    },

    getTitle() {
        return this.item.getTitle();
    },

    countChildrenTasks() {
        let res = 0;
        this.childrenItems.map((childrenId) => {
            let child = this.collection.get(childrenId);
            res += child.type === "task" ? 1 : 0;
            res += child.countChildrenTasks();
        });
        return res;
    },

    parse: function(obj) {
        let parent = null;

        switch (obj.type) {
            case 'project':
                obj.item = new ProjectModel(obj.item);
                obj.id = 'p-'+obj.item.id;

                if (obj.item.parentId) parent="p-"+obj.item.parentId;
                break;
            case 'task':
                obj.item = new TaskModel(obj.item);
                obj.id = 't-'+obj.item.id;

                if (obj.item.parentTaskId) parent="t-"+obj.item.parentTaskId;
                else parent="p-"+obj.item.projectId;
                break;
        }

        obj.parentId = parent;

        return obj;
    }
});

module.exports = GDHierarchyItem;