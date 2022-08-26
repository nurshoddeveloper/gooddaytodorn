const ProjectBasicModel = require('./project-basic');

module.exports = ProjectBasicModel.extend({
    props: {
        systemStatus: 'number',
        statusComments: 'string',
        companyId: 'string',
        role: 'number',
        shortName: 'string',
        color: 'number'

        // color
        // companyId
        // icon
        // id
        // name
        // parent
        // parentId
        // role
        // shortName
        // systemStatus
        // systemType

    },
    derived: {

        isArchived: {
            deps: ['systemStatus'],
            fn: function() {
                return (gd.const.systemStatus.isClosed(this.systemStatus));
            }
        },

        systemStatusName: {
            deps: ['systemStatus'],
            fn: function() {
                return gd.const.systemStatusList[this.systemStatus];
            }
        }
    },
    exportMenu: function() {
        return {
            id: "project-"+this.id,
            name: this.name,
            icon: this.iconSmall,
            type: 7, // company menu type
            isOpen: false,
            url: this.url,
            project: this
        };
    }
});