const AmpersandState = require('ampersand-state');

const RecentProjectModel = AmpersandState.extend({

    idAttribute: 'projectId',

    props: {
        projectId: 'string',
        date: 'object'
    },

    localStorageFormat() {
        return this.projectId+"-"+this.date.format('X');
    }
});

module.exports = RecentProjectModel;