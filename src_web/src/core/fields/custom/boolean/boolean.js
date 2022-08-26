import CustomFieldProto from '../../proto/custom-field-proto';

export default class BooleanCustomField extends CustomFieldProto {

    constructor(customField) {
        super(customField);
    }

    /*listItemGroupFunction() {
        return i=>!!i.item.customFieldsData[this.customField.id]
    }*/

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.type === 'project' ? 0 : !!i.item.customFieldsData[this.customField.id]],
            directions: [sort]
        }
    }
}