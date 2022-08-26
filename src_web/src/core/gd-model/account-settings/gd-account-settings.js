const AmpersandState = require('ampersand-state');

const GDAccountSettings = AmpersandState.extend({

    props: {
        notes: {
            type: 'string',
            default: ''
        },
        menu: {
            type: 'array',
            default: ()=>[]
        }
    }
});

module.exports = GDAccountSettings;