var AmpersandModel = require('ampersand-model');

//var Moment = require('moment');

module.exports = AmpersandModel.extend({
    idAttribute: "id",

    props: {
        id: 'string',
        tileType: 'number',
        sortPosition: 'number',
        companyId: 'string',
        data: 'object',
        target: 'any'
    }
});