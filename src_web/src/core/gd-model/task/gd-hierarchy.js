let AmpersandCollection = require('ampersand-collection');

let GDHierarchyItem = require('./gd-hierarchy-item');

let GDHierarchy = AmpersandCollection.extend({
    model: GDHierarchyItem,

    updateChildrenItems() {

        this.map(listItem=>{
            listItem.childrenItems = [];
        });

        this.map(listItem=>{
            if (listItem.parentId) {
                this.get(listItem.parentId).childrenItems.push(listItem.id);
            }
        });

    },
});

module.exports = GDHierarchy;