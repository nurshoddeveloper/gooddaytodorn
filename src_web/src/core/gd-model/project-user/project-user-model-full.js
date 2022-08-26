const AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',

        userId: 'string',
        projectId: 'string',
        projectRole: 'number',
        watchAll: 'boolean',
        access: 'number',
        inheritance: 'number'
    },

    parse(obj) {
        obj.id = obj.projectId+"-"+obj.userId;
        return obj;
    }
});

// const ProjectUserBasic = require('./project-user-basic');
//
// module.exports = ProjectUserBasic.extend({
//     props: {
//         watchAll: 'boolean',
//         isDeleted: 'boolean'
//     },
//     parse: function(obj){
//
//         ProjectUserBasic.prototype.parse.apply(this,[obj]);
//
//         return obj;
//     }
// });