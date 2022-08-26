const _ = require('lodash');
const AmpersandCollection = require('ampersand-collection');
const ProjectTypeModel = require('./project-type-model');


const ProjectTypeCollection = AmpersandCollection.extend({
    model: ProjectTypeModel,

    comparator: 'name',

    filterByCompany: function(companyId) {
        var arr = this.filter(function(w){
            return w.companyId==companyId
        }.bind(this));

        return new ProjectTypeCollection(arr);
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


    filterNotDeleted() {
        const arr = this.filter(w=>{
            return !w.isDeleted;
        });

        return new ProjectTypeCollection(arr);
    },

    exportToOptions: function() {
        return this.filter(m=>{ return !m.isDeleted; }).map(function(w){
            return {
                'value': w.id,
                'label': w.name
            }
        });
    },

    reinit() {
        this.map(projectType=>{
            projectType.statuses.map(projectStatus=>{
                projectStatus.status = gd.session.statuses.get(projectStatus.statusId);
            });
        });
    }

});

module.exports = ProjectTypeCollection;