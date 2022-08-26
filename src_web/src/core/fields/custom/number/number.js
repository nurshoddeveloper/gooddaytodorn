import CustomFieldProto from '../../proto/custom-field-proto';

export default class NumberCustomField extends CustomFieldProto {

    constructor(customField) {
        super(customField);
    }

    /*listItemGroupFunction() {
        return i=>i.item.customFieldsData[this.customField.id]
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