let AmpersandCollection = require('ampersand-collection');

let TaskHierarchyModel = require('./gd-hierarchy-item');

let TaskHierarchyCollection = AmpersandCollection.extend({
    model: TaskHierarchyModel,

    comparator(m) {
        return m.item.systemStatus;
    },

    updateChildrenItems() {

        // reset
        this.map(listItem=>{
            listItem.childrenItems = [];
        });

        this.map(listItem=>{
            if (listItem.parentId) {
                let parent = this.get(listItem.parentId);
                if (parent) parent.childrenItems.push(listItem.id);
            }
        });

    },

    getItemParents(id) {
        let res = [];

        let recursiveParents = function(id){
            let item = this.get(id);
            if (item && item.parentId) {
                res.push(item.parentId);
                recursiveParents(item.parentId)
            }
        }.bind(this);

        recursiveParents(id);

        return res;
    },

    containsSubtasks() {
        let res = false;
        this.map(listItem=>{
            if (listItem.type == 'task' && listItem.childrenItems.length > 0) res = true;
        });
        return res;
    }
});

module.exports = TaskHierarchyCollection;