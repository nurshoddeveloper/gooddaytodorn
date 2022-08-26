import CustomFieldProto from '../../proto/custom-field-proto';

export default class UserCustomField extends CustomFieldProto {

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
                    let res = '';
                    if (i.type === 'project') {

                    } else if (i.item.customFieldsData[this.customField.id]){
                        const user = gd.session.users.get(i.item.customFieldsData[this.customField.id]);
                        if (user) res = user.name;
                    }

                    return res;
                }
            ],
            directions: ['asc', sort]
        }
    }

}