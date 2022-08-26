const AmpersandCollection = require('ampersand-collection');
const ProjectModelSession = require('./project-model-session');


const ProjectCollectionSession = AmpersandCollection.extend({

    model: ProjectModelSession,

    //comparator: function(model1,model2) {
    //},

    initialize: function (models) {},

    filterNewTaskProjects() {

        return new ProjectCollectionSession(this.filter(function(project){
            return (!project.isArchived && project.role);
        }));

    },

    openProjects() {
        return new ProjectCollectionSession(this.filter(function(project){
            return (!project.isArchived);
        }));
    },

    filterByCompany: function(companyId){
        return new ProjectCollectionSession(this.filter(function(m){
            return (m.companyId==companyId);
        }),{});
    },

    exportToOptions: function() {
        return this.exportList();
    },

    search: function(q) {
        return new ProjectCollectionSession(this.filter(project => {
            return (!project.isTemplate && project.access && project.name.toLowerCase().indexOf(q) > -1);
        }));
    },

    findCompanyProjectsForTree(companyId, options = {}) {
        const { includeArchived, includeTemplates } = options;
        const result = [];

        this.map(m=>{
            if ((!m.isTemplate || includeTemplates) &&
                m.companyId === companyId &&
                (includeArchived || m.systemStatus < gd.const.systemStatus.COMPLETED)) {

                result.push({
                    access: m.access,
                    color: m.color,
                    companyId: m.companyId,
                    // customFields
                    // icon
                    id: m.id,
                    name: m.name,
                    parentId: m.parentId,
                    // role
                    // shortName
                    // systemStatus
                    sortPosition: m.sortPosition,
                    systemType: m.systemType
                })
            }
        });

        return result;
    },

    filterBySystemType(systemType){
        return new ProjectCollectionSession(this.filter(m=>m.systemType === systemType),{});
    },

    getAllParents(projectId) {
        const res = [];
        const project = this.get(projectId);

        const collectParent = parentId=>{
            if (parentId){
                const parent = this.get(parentId);
                if (parent){
                    res.push(parent);
                    collectParent(parent.parentId);
                }
            }
        };

        collectParent(project.parentId);

        return res.reverse();
    },

    exportList: function() {
        return this.map(function(project){
            return {
                'value': project.id,
                'label': project.name,
                'icon': project.iconNormal,
                'iconObj': project
            }
        });
    }

});

module.exports = ProjectCollectionSession;