import CustomFieldProto from '../../proto/custom-field-proto';

export default class ListCustomField extends CustomFieldProto {

    constructor(customField) {
        super(customField);
    }

    listItemGroupFunction() {
        return i=>i.item.customFieldsData[this.customField.id]
    }

    listItemSortFunctions(sort) {
        return {
            functions: [
                i => !!sort ? 0 : (i.type === 'project' ? 0 : !!i.item.customFieldsData[this.customField.id] ? 1 : 2),
                i => {
                    if (i.type === 'project') return 0;
                    if (!(this.customField.id in i.item.customFieldsData)) return 0;
                    if (!this.customField.params || !this.customField.params.listItems || this.customField.params.listItems.length < 2) return 0;

                    const value = i.item.customFieldsData ? i.item.customFieldsData[this.customField.id] : -1;

                    let optionIdxPlus1 = 1;
                    this.customField.params.listItems.some(li => {
                        if (li.id === value) {
                            return true;
                        }
                        optionIdxPlus1++;
                    });

                    return optionIdxPlus1;
                }
            ],
            directions: ['asc', sort]
        }
    }

}