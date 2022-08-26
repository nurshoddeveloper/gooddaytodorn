var AmpersandCollection = require('ampersand-collection');
var StatusModel = require('./status-model');
var _ = require('lodash');

var StatusesCollection = AmpersandCollection.extend({
    model: StatusModel,

    resetByCompany: function(companyId,newData) {

        var old = this.filter(function(w){
            return w.companyId == companyId;
        });

        _.each(old,function(model){
            this.remove(model,{ silent: true });
        }.bind(this));

        this.add(newData,{parse:true});
    },

    findBySystemStatus: function(systemStatus) {
        return this.models.filter(function(s) {
            return (s.systemStatus==systemStatus);
        });
    },

    findByName(name) {
        name = name.toLowerCase();

        let found = false;

        this.map(option=>{
            if (option.name.toLowerCase()==name) found = option;
        });

        return found;
    },

    filterByCompany(companyId) {
        var filteredModels = this.filter(function(model){
            return (model.companyId==companyId);
        });
        return new StatusesCollection(filteredModels);
    },

    exportToAutosuggest: function() {
        return this.map(function(m){
            return {
                name: m.name,
                color: m.color,
                id: m.id
            }
        })
    }
});

module.exports = StatusesCollection;