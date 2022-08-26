import SystemFieldProto from '../proto/system-field-proto';


export default class ProgressBarField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by progress %';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.item.progress || 0],
            directions: [sort]
        }
    }

}