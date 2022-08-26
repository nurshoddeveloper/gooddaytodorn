const AmpersandState = require('ampersand-state');

const RecentUser = AmpersandState.extend({
    idAttribute: 'id',

    props: {
        id: 'string',

        companyId: 'string',
        userId: 'string',
        date: 'object',

        userName: 'string',
        reports: ['boolean', false, false]
    },

    localStorageFormat: function() {
        return this.companyId + "-" + this.userId + "-" + this.date.format('X') + "-" + (this.reports ? "1":"0");
    },

    parse(obj) {
        obj.userName = gd.session.users.get(obj.userId).name;
        obj.id = obj.companyId + "-" + obj.userId;
        return obj;
    }
});

module.exports = RecentUser;