import SystemFieldProto from '../proto/system-field-proto';


export default class ActionRequiredField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by action required';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => (i.type === 'project' || !i.item.actionRequiredUserId) ? '-' : gd.session.users.get(i.item.actionRequiredUserId).name.toLowerCase()],
            directions: [sort]
        }
    }
}