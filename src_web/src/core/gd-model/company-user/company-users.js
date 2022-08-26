var AmpersandCollection = require('ampersand-collection');
var UsersCollection = require('../../gd-model/user/gd-users');
var CompanyUserModel = require('./company-user');
var _ = require('lodash');

var CompanyUsersCollection = AmpersandCollection.extend({
    model: CompanyUserModel,


    resetByCompany(companyId,newData) {

        console.error("method no is use - why r we here?");

        var oldUsersArr = this.filter(function(companyUser) {
            return companyUser.company.id == companyId;
        });

        _.each(oldUsersArr,function(model){
            this.remove(model,{ silent: true });
        }.bind(this));

        this.add(newData,{parse:true});
    },


    filterByCompany(companyId) {
        return new CompanyUsersCollection(this.filter(function(m){
            return (m.company.id==companyId);
        }),{parse:false});
    },

    findAllByDepartment: function(departmentId) {
        return this.filter(function(companyUser){
            return (companyUser.departmentId==departmentId);
        });
    },

    findAllByCompanyRole: function(companyRole) {
        return this.filter(function(companyUser){
            return (companyUser.companyRole==companyRole);
        });
    },

    filterByCompanies(arrCompanies) {
        return new CompanyUsersCollection(this.filter(function(companyUser){
            return (arrCompanies.indexOf(companyUser.company.id)>-1);
        }),{parse:false});
    },

    filterByCompanyAndRole(companyId,companyRole) {
        return new CompanyUsersCollection(this.filter(function(m){
            return (m.company.id==companyId && m.companyRole==companyRole);
        }),{parse:false});
    },

    filterByUser(userId) {
        return new CompanyUsersCollection(this.filter(m=>m.user.id === userId),{parse:false});
    },

    search: function(q) {
        return new CompanyUsersCollection(this.filter(function(m){
            return (m.user.name.toLowerCase().indexOf(q)>-1);
        }));
    },

    exportWhoReportsToMeMenu() {

        var myId = gd.session.me.id;

        var users =  this.filter(function(cu){
            return (cu.reportToUserId==myId);
        });

        var res = [];
        if (users && users.length>0) {

            users.map(function(cu){
                res.push({
                    id: "user-"+cu.id,
                    name: cu.user.name,
                    icon: cu.user.icon,
                    type: 9,
                    isOpen: false,
                    url: cu.url,
                    user: cu,
                    company: cu.company
                });
            });

        }

        var userConter = {};

        res.map(function(o){
            if (o.type==9) {
                var userId = o.user.user.id;
                if (!userConter[userId]) userConter[userId]=1;
                else userConter[userId] = userConter[userId] + 1;
            }
        });

        res.map(function(o){
            if (o.type==9) {
                var userId = o.user.user.id;
                if (userConter[userId]<2) o.company = null;
            }
        });

        return res;
    },

    exportToOptions() {
        return this.map(function(companyUser){
            return {
                'value': companyUser.user.id,
                'label': companyUser.user.name,
                'icon': companyUser.user.icon,
                'iconObj': companyUser.user
            }
        });
    },

    findByCompanyAndUser(companyId, userId) {

        let result = null;

        this.map(function(cu){
            if (cu.user && cu.company && cu.user.id === userId && cu.company.id === companyId) {
                result = cu;
                return false; // stop mapping
            }
        });

        return result;
    },
    
    exportToUsersCollection() {
        var out = new UsersCollection();
        this.map(function(model){
            out.add(model.user);
        });
        return out;
    }
});

module.exports = CompanyUsersCollection;