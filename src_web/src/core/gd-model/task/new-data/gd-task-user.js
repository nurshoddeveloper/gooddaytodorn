const AmpersandState = require('ampersand-state');

const TaskUser = AmpersandState.extend({

    idAttribute: 'userId',

    props: {
        role: 'number',
        notifications: 'boolean',
        userId: 'string'
    }
});

module.exports = TaskUser;