const AmpersandCollection = require('ampersand-collection');
const WorkScheduleAccessModel = require('./work-schedule-access-model');

const WorkScheduleAccessCollection = AmpersandCollection.extend({
    model: WorkScheduleAccessModel
});

module.exports = WorkScheduleAccessCollection;