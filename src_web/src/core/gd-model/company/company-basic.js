var AmpersandModel = require('ampersand-model');
var React = require('react');

module.exports = AmpersandModel.extend({
    idAttribute: "id",

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
        iconNormal: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.png';
                return "/media/company/norm/"+this.icon;
            }
        },
        iconSmall: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.png';
                return "/media/company/small/"+this.icon;
            }
        },
        iconLarge: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.png';
                return "/media/company/large/"+this.icon;
            }
        },
        url: {
            deps: ['id'],
            fn: function() {
                return "o/"+this.id;
            }
        }
    }

});