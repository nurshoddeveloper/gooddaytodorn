import SystemFieldProto from '../proto/system-field-proto';


export default class TimerReportedField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by reported time';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.countTimeReported() || 0],
            directions: [sort]
        }
    }

}