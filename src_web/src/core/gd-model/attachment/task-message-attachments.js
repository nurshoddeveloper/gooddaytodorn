var TaskMessageAttachment = require('./task-message-attachment');
var AmpersandCollection = require('ampersand-collection');

module.exports = AmpersandCollection.extend({
    model: TaskMessageAttachment,

    indexes: ['fileId']
});