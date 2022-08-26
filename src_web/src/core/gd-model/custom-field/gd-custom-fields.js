const _ = require('lodash');
const AmpersandCollection = require('ampersand-collection');
const CustomFieldModel = require('./gd-custom-field');


const GDCustomFields = AmpersandCollection.extend({
    model: CustomFieldModel,

    comparator: "sortPosition",

    exportItems() {
        return this.map((model)=>{
            return {
                'value': model.id,
                'label': model.name
            }
        });
    },

    filterByCompany(companyId) {
        return new GDCustomFields(this.filter((m)=>m.companyId === companyId && !m.isDeleted)).sort();
    },

    resetByCompany(companyId,newData) {
        const oldTasks = this.filter((taskType)=>{
            return taskType.companyId === companyId;
        });

        _.each(oldTasks,(model)=>{this.remove(model,{ silent: true });});

        this.add(newData,{parse:true});
    },

    exportOptions() {

        const getIcon = (type)=>{
            return gd.const.customFields[type].icon || '';
        };


        return this.filter(m=>!m.isDeleted).map((m)=>{
            return {
                value: m.id,
                label: m.name,
                icon: getIcon(m.type)
            }
        })
    }

});


module.exports = GDCustomFields;