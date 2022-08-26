const AmpersandCollection = require('ampersand-collection');
const GDTaskType = require('./gd-task-type');
const _ = require('lodash');

const GDTaskTypes = AmpersandCollection.extend({
    model: GDTaskType,

    comparator: "sortPosition",

    exportItems() {
        return this.map(model=>{
            return {
                'value': model.id,
                'label': model.name,
                'iconClass': model.icon
            }
        });
    },

    filterByCompany(companyId) {
        return new GDTaskTypes(this.filter(m=>m.companyId === companyId && !m.isDeleted)).sort();
    },

    resetByCompany(companyId,newData) {
        const oldTasks = this.filter(taskType=>taskType.companyId === companyId);

        _.each(oldTasks,model=>{
            this.remove(model,{ silent: true });
        });

        this.add(newData,{parse:true});
    },

    exportOptions() {
        return this.filter(m=>!m.isDeleted).map(m=>{
            return {
                value: m.id,
                label: m.name,
                icon: m.icon,
                isGeneric: m.settings && m.settings.isGeneric
            }
        })
    },

    reinit() {
        this.map(taskType=>{
            taskType.statuses.map(taskStatus=>{
                taskStatus.status = gd.session.statuses.get(taskStatus.statusId);
            });
        });
    }
});

module.exports = GDTaskTypes;