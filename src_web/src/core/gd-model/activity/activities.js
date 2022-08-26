const AmpersandCollection = require('ampersand-collection');
const ActivityModel = require('./activity');
const _ = require('lodash');


const ActivitiesCollection = AmpersandCollection.extend({
    model: ActivityModel,

    initialize: function (models) {
    },

    findAllProjects() {
        const objRes = this.findFilterOptions('project');
        return _.sortBy(objRes,'counter');
    },

    findCompanyFilterValues() {
        const objRes = this.findFilterOptions('company');
        return _.sortBy(objRes,'counter');
    },

    findCreatedBy() {
        const objRes = this.findFilterOptions('user');
        return _.sortBy(objRes,'counter');
    },

    findFilterOptions(field) {
        const result = {};

        if (!this.models || !this.models[0] || !this.models[0]['id']) {
            return {};
        }

        this.models.forEach(m=>{

            if (!m[field]) {
                //skip null objects... it's possible i.e. actionrequired = null
                return;
            }

            if (!result[m[field]['id']]) {
                result[m[field]['id']] = {
                    counter: 0
                };
                result[m[field]['id']]['item'] = m[field];

            } else {
                //console.log("object oalready there");
            }

            result[m[field]['id']]['counter']++;
        });

        return result;
    }

});

module.exports = ActivitiesCollection;