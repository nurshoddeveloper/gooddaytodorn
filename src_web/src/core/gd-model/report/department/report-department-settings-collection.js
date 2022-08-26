var AmpersandCollection = require('ampersand-collection');
var DepartmentReportSettings = require('./report-department-settings');

module.exports = AmpersandCollection.extend({
    model: DepartmentReportSettings,

    comparator: function(m) {
        return m.department.name;
    }

});