const AmpersandCollection = require('ampersand-collection');
const ProjectBasicModel = require('./project-basic');


const ProjectsCollection = AmpersandCollection.extend({
    model: ProjectBasicModel,

    comparator: 'name',

    exportToOptions: function() {
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

module.exports = ProjectsCollection;