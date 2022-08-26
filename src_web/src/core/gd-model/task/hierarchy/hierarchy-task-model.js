let AmpersandState = require('ampersand-state');

let HierarchyTaskModel = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        projectId: 'string',
        parentTaskId: 'string',
        taskTypeId: 'string',
        systemType: 'number',
        systemStatus: 'number',
        title: 'string'
    },

    getTitle() {
        return this.title;
    }
});

module.exports = HierarchyTaskModel;