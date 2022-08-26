import SystemFieldProto from '../proto/system-field-proto';


export default class AssignedToField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by assigned';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => (i.type === 'project' || !i.item.assignedToUserId) ? '-' : gd.session.users.get(i.item.assignedToUserId).name.toLowerCase()],
            directions: [sort]
        }
    }
}