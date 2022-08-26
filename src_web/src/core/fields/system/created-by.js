import SystemFieldProto from '../proto/system-field-proto';


export default class CreatedByField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by created by';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => (i.type === 'project' || !i.item.createdByUserId) ? '-' : gd.session.users.get(i.item.createdByUserId).name.toLowerCase()],
            directions: [sort]
        }
    }
}