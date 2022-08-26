var AmpersandCollection = require('ampersand-collection');
var ProjectReportSettings = require('./report-project-settings');

module.exports = AmpersandCollection.extend({
    model: ProjectReportSettings,

    initialize: function (models) {
    },

    comparator: function(m) {
        return m.project.name;
    }

});