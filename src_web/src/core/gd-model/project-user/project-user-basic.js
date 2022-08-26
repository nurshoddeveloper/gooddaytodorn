const AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        projectRole: 'number',
        //watchAll: 'boolean',

        access: 'number',

        project: 'object',
        user: 'object'
    },

    parse(obj) {

        obj.id = obj.projectId+"-"+obj.userId;
        obj.user = gd.session.users.get(obj.userId);
        obj.project = gd.session.projects.get(obj.projectId);

        //if (!obj.user) console.error("No user found session init");
        if (!obj.project) console.error("No project object - project users session init proj=",obj.projectId,"user=",obj.userId);

        return obj;
    }
});