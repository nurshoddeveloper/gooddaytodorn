let AmpersandState = require('ampersand-state');

let HierarchyProjectModel = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        parentId: 'string',
        systemStatus: 'number',
        name: 'string'
    },

    getTitle() {
        return this.name;
    }
});

module.exports = HierarchyProjectModel;