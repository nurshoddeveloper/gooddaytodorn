import SystemFieldProto from '../proto/system-field-proto';


export default class EstimateField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by estimate time';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.item.estimate || 0],
            directions: [sort]
        }
    }
}