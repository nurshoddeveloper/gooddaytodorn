var AmpersandCollection = require('ampersand-collection');
var InvitationModel = require('./user-invitation');

var UserInvitations = AmpersandCollection.extend({
    model: InvitationModel

});

module.exports = UserInvitations;