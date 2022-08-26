import _ from 'lodash';
import CustomFieldProto from '../../proto/custom-field-proto';

export default class RatingCustomField extends CustomFieldProto {

    constructor(customField) {
        super(customField);
    }

    listItemGroupFunction() {
        const { id, params } = this.customField;

        const normalizeRatingValue = value=>{
            let res = value;
            if (!_.isNil(res)) {
                switch (params.ratingType) {
                    case 5: if (res > 5) res = 5; break;
                    case 3: if (res > 3) res = 3; break;
                }
            }

            return res;
        };

        return i=>normalizeRatingValue(i.item.customFieldsData[id])
    }

    listItemSortFunctions(sort) {
        return {
            functions: [
                i => !!sort ? 0 : (i.type === 'project' ? 0 : !!i.item.customFieldsData[this.customField.id] ? 1 : 2),
                i => i.type === 'project' ? 0 : (i.item.customFieldsData[this.customField.id] || 0)
            ],
            directions: ['asc', sort]
        }
    }

}