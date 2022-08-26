const AmpersandCollection = require('ampersand-collection');
const MyCompany = require('./my-company');


const MyCompanies = AmpersandCollection.extend({

    model: MyCompany,

    comparator: function(m) {
        return -gd.session.recent.organizations.getCounter(m.id);
    },

    filterByRoles(arrRoles) {

        return new MyCompanies(this.filter(function(m){
            return (arrRoles.indexOf(m.role)>-1);
        }),{});


    },

    filterByLevel: function(companyRole){
        return new MyCompanies(this.filter(function(m){
            return (m.role==companyRole);
        }),{});
    },

    // initialize: function (models) {
    //     console.log("init");
    // },

    getPositionById(companyId) {
        return this.indexOf(this.get(companyId));
    },

    exportMenu: function () {
        let menu = this.map(function (company) {
            return company.exportMenu()
        });

        return menu;
    },

    exportToOptions() {
        return this.map(function(m){
            return {
                'value': m.id,
                'label': m.name,
                'icon': m.iconNormal,
                'iconObj': m
            }
        });
    },

    exportList: function () {
        console.error("GD warning: MyCompanies exportList function is deprecated");
        return this.map(function(company){
            return {
                'label': company.name,
                'value': company.id,
                'icon': company.iconNormal
            }
        })
    }

});

module.exports = MyCompanies;