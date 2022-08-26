var AmpersandCollection = require('ampersand-collection');
var UserBasicModel = require('./gd-user-basic');
var _ = require('lodash');

var GDUsers = AmpersandCollection.extend({
    model: UserBasicModel

});

module.exports = GDUsers;