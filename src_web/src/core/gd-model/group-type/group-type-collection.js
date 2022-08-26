var _ = require('lodash');
var AmpersandCollection = require('ampersand-collection');
var GroupTypeModel = require('./group-type-model');


var GroupTypeCollection = AmpersandCollection.extend({
    model: GroupTypeModel,

    comparator: 'name',

    filterByCompany: function(companyId) {
        var arr = this.filter(function(w){
            return w.companyId==companyId
        }.bind(this));

        return new GroupTypeCollection(arr);
    },

    resetByCompany: function(companyId,newData) {

        var oldFlows = this.filter(function(w){
            return w.companyId == companyId;
        });

        _.each(oldFlows,function(model){
            this.remove(model,{ silent: true });
        }.bind(this));

        this.add(newData,{parse:true});
    },

    exportToOptions: function() {
        return this.map(function(w){
            return {
                'value': w.id,
                'label': w.name
            }
        });
    },

    reinit() {
        this.map(groupType=>{
            groupType.statuses.map(groupStatus=>{
                groupStatus.status = gd.session.statuses.get(groupStatus.statusId);
            });
        });
    }

});

module.exports = GroupTypeCollection;