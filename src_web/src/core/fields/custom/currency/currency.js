import CustomFieldProto from '../../proto/custom-field-proto';

export default class CurrencyCustomField extends CustomFieldProto {

    constructor(customField) {
        super(customField);
    }

    /*listItemGroupFunction() {
        return i=>{
            const value = i.item.customFieldsData[this.customField.id];
            return value ? value : 0;
        }
    }*/

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