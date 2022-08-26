const AmpersandCollection = require('ampersand-collection');
const TaskUser = require('./gd-task-user');

const TaskUsersCollection = AmpersandCollection.extend({
    model: TaskUser,

    initialize: function (models) {
    },

    exportList: function(companyId) {

        const result = [];

        this.map(function(taskUser){

            // temp fix.... deleted from company user shouldn't appear in here
            if (companyId) {
                // obj.companyId+"-"+obj.userId;
                const companyUser = gd.session.companyUsers.get(companyId+'-'+taskUser.user.id);
                if (!companyUser) return;
            }

            result.push({
                'value': taskUser.user.id,
                'label': taskUser.user.name,
                'icon': taskUser.user.icon,
                'iconObj': taskUser.user
            });

        });

        return result;
    },

    getUserRole(userId) {
        let role = null;
        this.map(function(taskUser){
            if (taskUser.user.id==userId) role = taskUser.role;
        });
        return role;
    },

    getUserById(userId) {
        let res;
        this.map(function(taskUser){
            if (taskUser.user.id==userId) res = taskUser.user;
        });
        return res;
    }

});

module.exports = TaskUsersCollection;