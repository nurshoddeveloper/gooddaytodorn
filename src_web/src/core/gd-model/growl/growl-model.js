let AmpersandSate = require('ampersand-state');

module.exports = AmpersandSate.extend({

    props: {
        id: 'string',
        type: 'string',
        message: 'any',
        isSticky: { // sticky = doesn't dissapear when go to next page
            type: 'boolean',
            default: false
        },
        selfDestroy: { // self destroy within XXX seconds
            type: 'boolean',
            default: true
        }
    }
});