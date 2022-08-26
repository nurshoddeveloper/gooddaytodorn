var Moment = require('moment');
var AmpersandModel = require('ampersand-model');
var TaskStandardModel = require('../../../core/gd-model/task/task-standard');


module.exports = AmpersandModel.extend({
    props: {
        id: 'string',
        date: 'object',
        reportedMinutes: 'number',
        estimatedMinutes: 'number'
    },
    children: {
        task: TaskStandardModel
    },

    parse(obj) {
        obj.date = Moment(obj.date);
        return obj;
    }
});