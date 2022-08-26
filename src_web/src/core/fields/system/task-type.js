import SystemFieldProto from '../proto/system-field-proto';


export default class TaskTypeField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by task type';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [
                i => i.type === 'task' ? gd.session.taskTypes.get(i.item.taskTypeId).sortPosition : 0,
                i => i.type === 'task' ? gd.session.taskTypes.get(i.item.taskTypeId).name.toLowerCase() : 0,
            ],
            directions: [sort, sort]
        }
    }
}