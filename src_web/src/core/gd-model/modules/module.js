const AmpersandState = require('ampersand-state');

const Module = AmpersandState.extend({
    idAttribute: 'companyId',

    props: {
        companyId: 'string',
        gDrive: 'object',
        gCalendar: 'object'
    },

    parse(obj) {

        return obj;
    }
});

module.exports = Module;