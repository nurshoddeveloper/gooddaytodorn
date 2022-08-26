const AmpersandCollection = require('ampersand-collection');
const _ = require('lodash');


const FilterableCollection = AmpersandCollection.extend({
    

    findFilterOptionsByObjectField(fieldName) {

        if (!this.models || !this.models[0] || !this.models[0]['id']) return [];

        let result = {};
        this.models.forEach(function(m){

            if (!m[fieldName]) {
                //skip null objects... it's possible i.e. actionrequired = null
                return;
            }

            if (!result[m[fieldName]['id']]) {
                result[m[fieldName]['id']] = {
                    counter: 0,
                    item: m[fieldName]
                };
                //result[m[field]['id']]['item'] = m[field];

            } else {
                //console.log("object oalready there");
            }

            result[m[fieldName]['id']]['counter']++;
        });

        return _.sortBy(result,'counter');
    }

});

module.exports = FilterableCollection;