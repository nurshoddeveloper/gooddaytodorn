var AmpersandCollection = require('ampersand-collection');
var TaskModel = require('./quick-task');

var QuickTasks = AmpersandCollection.extend({
    model: TaskModel,

    initialize: function (models) {
    }

});

module.exports = QuickTasks;