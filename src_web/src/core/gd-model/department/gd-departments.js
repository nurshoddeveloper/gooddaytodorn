const _ = require('lodash');
const AmpersandCollection = require('ampersand-collection');
const DepartmentModel = require('./gd-department');


const DepartmentCollection = AmpersandCollection.extend({
    model: DepartmentModel,

    initialize: function (models) {
    },

    findByCompany: function(companyId) {
        return this.filter(function(model){
            return (model.companyId == companyId);
        })
    },

    filterByCompany: function(companyId) {
        return new DepartmentCollection(this.filter(function(model){
            return (model.companyId == companyId);
        }),{parse:true});
    },

    exportToOptions: function() {
        return this.map(function(m){
            return {
                value: m.id,
                label: m.name
            }
        })
    },

    resetByCompany: function(companyId,newData) {

        const oldDepartments = this.findByCompany(companyId);

        _.each(oldDepartments,function(model){
            this.remove(model,{ silent: true });
        }.bind(this));

        _.each(newData,function(obj){
            this.add(obj);
        }.bind(this));
    }



});

module.exports = DepartmentCollection;