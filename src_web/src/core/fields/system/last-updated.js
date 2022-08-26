import SystemFieldProto from '../proto/system-field-proto';


export default class LastUpdatedField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by last updated date';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.type === 'project' ? 0 : -i.item.recentActivityMoment.unix()],
            directions: [sort]
        }
    }
}