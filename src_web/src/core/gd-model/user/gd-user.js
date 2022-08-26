const AmpersandState = require('ampersand-state');
const React = require('react');

// ToDo - nabdo budet prevratit' eto v CompanyUser model vse taki ... da eto vazno konechno ....

var GDUser = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        //id: 'string',
        userId: 'string',
        name: 'string',
        icon: 'string',
        companyId: 'string',
        companyRole: 'number',
        departmentId: 'string',

        user: 'object'
    },

    derived: {
        id: {
            deps: ['userId', 'companyId'],
            fn: function () {
                return this.companyId + '-' + this.userId;
            }
        },
        companyRoleName: {
            deps: ['companyRole'],
            fn: function() {
                return gd.const.companyRoleList[this.companyRole];
            }
        },
        url: {
            deps: ['userId','companyId'],
            fn: function() {
                return "u/"+this.id;
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
        },

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
        }
    },

    getByUserId(userId) {

    }

});

module.exports = GDUser;