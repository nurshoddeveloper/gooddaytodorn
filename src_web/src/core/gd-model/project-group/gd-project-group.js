var AmpersandModel = require('ampersand-model');

var GDProjectGroup = AmpersandModel.extend({
    props: {
        id: 'string',
        companyId: 'string',
        name: 'string'
    }
});

module.exports = GDProjectGroup;