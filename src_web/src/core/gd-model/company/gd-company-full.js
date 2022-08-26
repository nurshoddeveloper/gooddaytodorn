const CompanyBasicModel = require('./company-basic');

module.exports = CompanyBasicModel.extend({
    idAttribute: "id",
    props: {
        about: 'string',
        siteUrl: 'string',
        timezone: 'string',
        accountType: 'number'
    },
    parse: function(obj){

        if (!obj.about) obj.about = '';
        if (!obj.siteUrl) obj.siteUrl = '';

        return obj;
    }
});
