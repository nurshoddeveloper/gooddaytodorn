import CustomFieldProto from '../../proto/custom-field-proto';

export default class StringCustomField extends CustomFieldProto {

    constructor(customField) {
        super(customField);
    }

    /*listItemGroupFunction() {
        return i=>{
            let res = i.item.customFieldsData[this.customField.id];
            return res ? res : null;
        }
    }*/

    listItemSortFunctions(sort) {
        return {
            functions: [
                i => !!sort ? 0 : (i.type === 'project' ? 0 : !!i.item.customFieldsData[this.customField.id] ? 1 : 2),
                i => i.type === 'project' ? 0 : (i.item.customFieldsData[this.customField.id] || '')
            ],
            directions: ['asc', sort]
        }
    }


}