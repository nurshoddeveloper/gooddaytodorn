let AmpersandCollection = require('ampersand-collection');
let GrowlModel = require('./growl-model');

let GrowlCollection = AmpersandCollection.extend({
    model: GrowlModel
});

module.exports = GrowlCollection;