var AmpersandCollection = require('ampersand-collection');
var ProjectHistoryModel = require('./project-history');

var ProjectHistories = AmpersandCollection.extend({
    model: ProjectHistoryModel
});

module.exports = ProjectHistories;