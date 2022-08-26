import SystemFieldProto from '../proto/system-field-proto';


export default class TitleField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by title';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.getName().toLowerCase()],
            directions: [sort]
        }
    }
}