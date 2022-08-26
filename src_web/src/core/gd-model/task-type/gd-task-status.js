var AmpersandState = require('ampersand-state');
var StatusModel = require('../status/status-model');
//var React = require('react');

module.exports = AmpersandState.extend({
    props: {
        id: 'string',
        statusId: 'string',
        status: 'object',
        taskTypeId: 'string',
        sortPosition: 'number'
    },

    derived: {
        systemStatus: {
            deps: ['statusId,status'],
            fn: function () {
                return (this.status)?this.status.systemStatus:null;
            }
        }
    },

    parse: function(obj) {

        if (obj.statusId) {
            obj.status = gd.session.statuses.get(obj.statusId);
        }

        return obj;
    }

    // dont' need it anymore...
    //renderStatus() {
    //    var className = 'status-color-'+this.color+' gd-task-status';
    //    return (<div className={className}>{this.name}</div>)
    //}
});