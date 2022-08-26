import SystemFieldProto from '../proto/system-field-proto';


export default class TaskIdField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by task id #';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [
                i => i.type === 'task' ? parseInt(i.item.shortId) : 0,
            ],
            directions: [sort]
        }
    }
}