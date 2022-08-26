import SystemFieldProto from '../proto/system-field-proto';


export default class PriorityField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by priority';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.item.priority],
            directions: [sort]
        }
    }

}
