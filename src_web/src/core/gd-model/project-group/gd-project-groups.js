var AmpersandCollection = require('ampersand-collection');
var GDProjectGroup = require('./gd-project-group');
var _ = require('lodash');

var GDProjectGroups = AmpersandCollection.extend({
    model: GDProjectGroup,

    initialize: function (models) {
    },

    findByCompany: function(companyId) {

        return this.filter(function(model){
            return (model.companyId == companyId);
        })
    },
    resetByCompany: function(companyId,newData) {
        var _this = this;

        var oldGroups = this.findByCompany(companyId);

        _.each(oldGroups,function(model){
            _this.remove(model,{ silent: true });
        });

        _.each(newData,function(obj){
            _this.add(obj);
        });

        console.log(">>> add done ",this.models);
    }

});

module.exports = GDProjectGroups;