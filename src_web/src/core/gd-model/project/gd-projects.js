const AmpersandCollection = require('ampersand-collection');
const GDProject = require('./gd-project');


const GDProjects = AmpersandCollection.extend({
    model: GDProject,

    //comparator: function(model1,model2) {
    //},

    initialize: function (models) {
    },

    filterNewTaskProjects() {

        return new GDProjects(this.filter(function(project){
            return (!project.isArchived && project.role);
        }));

    },

    openProjects() {
        return new GDProjects(this.filter(function(project){
            return (!project.isArchived);
        }));
    },

    filterByCompany: function(companyId){
        return new GDProjects(this.filter(function(m){
            return (m.companyId==companyId);
        }),{});
    },

    exportToOptions: function() {
        return this.exportList();
    },

    search: function(q) {
        return new GDProjects(this.filter(function(m){
            return (m.name.toLowerCase().indexOf(q)>-1);
            //return (m.name.search(q)>-1)
        }));
    },

    exportMenu: function () {
        var arrMenuProjects = [];

        this.map(function (project) {
            if (!project.isArchived) arrMenuProjects.push(project.exportMenu())
        });

        return arrMenuProjects;
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

module.exports = GDProjects;