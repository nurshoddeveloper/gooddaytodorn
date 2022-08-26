const AmpersandCollection = require('ampersand-collection');
const AmpersandModel = require('ampersand-model');

const ProjectBasicModel = AmpersandModel.extend({
    type: 'project',
    props: {
        id: 'string',
        name: 'string',
        icon: 'string',
        color: 'number'

    },
    derived: {
        initials: {
            deps: ['name'],
            fn: function() {
                return gd.utils.initials(this.name,3);
            }
        },
        url: {
            deps: ['id'],
            fn: function() {
                return "p/"+this.id;
            }
        }
    }
});



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