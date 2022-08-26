const AmpersandModel = require('ampersand-model');

const GDDepartment = AmpersandModel.extend({
    props: {
        id: 'string',
        companyId: 'string',
        name: 'string',
        users: 'number'
    }
});

module.exports = GDDepartment;