const AmpersandModel = require('ampersand-model');

const StarredItem = AmpersandModel.extend({
    props: {
        id: 'string',
        taskId: 'string',
        projectId: 'string'
    }
});

module.exports = StarredItem;