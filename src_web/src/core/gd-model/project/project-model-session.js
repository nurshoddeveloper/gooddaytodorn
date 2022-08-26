import AmpersandStateExtended from '../../../core/gd-model/ampersand-state-extended';

//andrew
//import NavigationManager from '../../gd/manager/navigation/navigation-manager';

const ProjectModelSession = AmpersandStateExtended.extend({

    props: {
        id: 'string',
        name: 'string',
        icon: 'string',
        color: 'number',
        companyId: 'string',
        parentId: 'string',
        projectIcon: 'string',

        role: 'number', // user role in cur project
        access: 'number', // user access in cur project

        shortName: 'string',
        systemStatus: 'number',
        systemType: 'number',
        projectTypeId: 'string',
        statusId: 'string',
        defaultView: 'string',
        projectViews: 'object',
        taskStatusesOverride: 'array',

        description: 'string',

        customFields: {
            type: 'array',
            default: () => []
        },

        taskTypes: {
            type: 'array',
            default: () => []
        },

        isDeleted: 'boolean',
        isTemplate: 'boolean',               //projects only
        templateContent: {
            type: 'object',
            default: () => ({
                customFields:   false,
                events:         false,
                subProjects:    false,
                subTasks:       false,
                tasks:          false,
            })
        },                                  //templates only

        localTemplateId: 'string',          //projects only
        sharedTemplateId: 'string',         //templates only

        statuses: 'array',
        sortPosition: 'number',

        settings: 'object'
    },

    derived: {

        // path for older version support
        initials: {
            deps: ['name, shortName'],
            fn: function() {

                if (this.shortName) {
                    return this.shortName;
                } else {
                    console.error("NO SHORT NAME IN PROJECT SESSION MODEL",this);
                    return gd.utils.initials(this.name,3);
                }
            }
        },

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
        },

        url: {
            deps: ['id'],
            fn: function() {
                return "p/"+this.id;
            }
        }
    },

    getDefaultView(useLocalStorage = false) {
        let res = null;

        //andrew
        //if (useLocalStorage) res = NavigationManager.getDefaultViewByProjectId(this.id);

        if (!res) {
            if (this.defaultView) res = this.defaultView;
            else if (this.parentId) {
                const project = gd.session.projects.get(this.parentId);
                if (project) res = project.getDefaultView();
            }
        }


        res = gd.utils.getDefaultView(this.systemType, res);

        return res;
    },

    getDefaultAppName() {
        //andrew
        //return NavigationManager.getRouterData(this.getDefaultView(true));
    }
});

module.exports = ProjectModelSession;