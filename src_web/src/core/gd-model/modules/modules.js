const AmpersandCollection = require('ampersand-collection');
const ModuleModel = require('./module');

const Modules = AmpersandCollection.extend({
    model: ModuleModel

});

module.exports = Modules;