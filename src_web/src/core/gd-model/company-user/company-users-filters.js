var UsersCollection = require('./company-users');
var _ = require('lodash');

var Users = UsersCollection.extend({


    findCompanyRoleFilterValues: function() {
        var objRes = this.findFilterOptions('companyRole');
        return _.sortBy(objRes,'counter');
        //return arrRes;
    },

    findCompanyFilterValues: function() {
        var objRes = this.findFilterOptions('company');
        return _.sortBy(objRes,'counter');
    },

    findDepartmentFilterValues: function() {
        var objRes = this.findFilterOptions('departmentId');
        return _.sortBy(objRes,'counter');
        //return arrRes;
    },

    findAllByCompany: function(companyId) {
        return this.filter(function(companyUser){
            return (companyUser.company.id==companyId);
        });
    },

    findFilterOptions: function(field) {
        var result = {};

        if (!this.models || !this.models[0] || !this.models[0]['id']) {
            return {};
        }

        this.models.forEach(function(m){
            var key = (m[field]['id'])?m[field]['id']:m[field];

            if (!result[key]) {
                result[key] = {
                    counter: 0,
                    item: m[field]
                };
            } else {
                //console.log("object oalready there");
            }

            result[key]['counter']++;
        });

        return result;
    }

});

module.exports = Users;