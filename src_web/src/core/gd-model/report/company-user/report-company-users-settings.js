var AmpersandCollection = require('ampersand-collection');
var CompanyUserReportSettings = require('./report-company-user-settings');

module.exports = AmpersandCollection.extend({
    model: CompanyUserReportSettings,

    initialize: function (models) {
    },

    comparator: function(m) {
        return m.user.name;
    }

});