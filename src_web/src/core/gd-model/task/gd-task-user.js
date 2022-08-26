const AmpersandState = require('ampersand-state');
const User = require('../user/gd-user-basic');

const TaskUser = AmpersandState.extend({

    idAttribute: 'id',

    props: {
        taskId: 'string',
        role: 'number',
        notifications: 'boolean',
        user: 'object'
    },

    derived: {
        id: {
            deps: ['taskId', 'user'],
            fn: function () {
                return this.taskId + '-' + this.user.id;
            }
        }
    },



    parse: function(obj) {
        obj.user = new User(obj.user);
        return obj;
    }
});

module.exports = TaskUser;