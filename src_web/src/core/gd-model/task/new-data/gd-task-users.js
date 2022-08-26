const AmpersandCollection = require('ampersand-collection');
const TaskUser = require('./gd-task-user');

const TaskUsersCollection = AmpersandCollection.extend({
    model: TaskUser,

    initialize(models){},

    exportList(companyId) {
        const result = [];

        this.map(taskUser=>{

            // temp fix.... deleted from company user shouldn't appear in here
            if (companyId) {
                const companyUser = gd.session.companyUsers.get(companyId+'-'+taskUser.userId);
                if (!companyUser) return;
            }

            const user = gd.session.users.get(taskUser.userId);
            result.push({
                'value': user.id,
                'label': user.name,
                'icon': user.icon,
                'iconObj': user
            });

        });

        return result;
    },

    getUserRole(userId) {
        let role = null;
        this.map(taskUser=>{
            if (taskUser.userId === userId) role = taskUser.role;
        });
        return role;
    }

});

module.exports = TaskUsersCollection;