const AmpersandState = require('ampersand-state');

module.exports =  AmpersandState.extend({
    idAttribute: 'id',
    type: 'user',
    props: {
        id: 'string',
        name: 'string',
        icon: 'string'
    },
    derived: {
        iconNormal: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.jpeg';
                return "/media/user/norm/"+this.icon;
            }
        },
        iconSmall: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.jpeg';
                return "/media/user/small/"+this.icon;
            }
        },
        iconLarge: {
            deps: ['icon'],
            fn: function() {
                if (!this.icon) this.icon = '_def.jpeg';
                return "/media/user/large/"+this.icon;
            }
        },
        initials: {
            deps: ['name'],
            fn: function() {
                return gd.utils.initials(this.name,2);
            }
        },

        color: {
            deps: ['name'],
            fn: function() {
                return gd.utils.nameColor(this.name);
            }
        }
    }
});