const AmpersandModel = require('ampersand-model');
const React = require('react');

module.exports = AmpersandModel.extend({
    type: 'project',
    props: {
        id: 'string',
        name: 'string',
        icon: 'string'

    },
    derived: {
        initials: {
            deps: ['name'],
            fn: function() {
                return gd.utils.initials(this.name,3);
            }
        },
        color: {
            deps: ['name'],
            fn: function() {
                return gd.utils.nameColor(this.name);
            }
        },
        iconNormal: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.png';
                return "/media/project/norm/"+this.icon;
            }
        },
        iconSmall: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.png';
                return "/media/project/small/"+this.icon;
            }
        },
        iconLarge: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.png';
                return "/media/project/large/"+this.icon;
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