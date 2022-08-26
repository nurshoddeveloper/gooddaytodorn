const AmpersandState = require('ampersand-state');
const UserBasic = require('../user/gd-user-basic');

module.exports = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        companyRole: 'number',
        departmentId: 'string',
        reportToUserId: 'string',
        isAdmin: {
            type: 'boolean',
            default: false
        },

        user: 'object',
        company: 'object'
    },

    derived: {
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
        }
    },

    parse(obj) {

        obj.user = gd.session.users.get(obj.userId);
        obj.company = gd.session.companies.get(obj.companyId);

        obj.id = obj.companyId+"-"+obj.userId;

        return obj;
    }

});