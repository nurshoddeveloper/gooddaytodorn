import SystemFieldProto from '../proto/system-field-proto';


export default class DateCreatedField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by date created';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.item.momentCreated.unix()],
            directions: [sort]
        }
    }
}