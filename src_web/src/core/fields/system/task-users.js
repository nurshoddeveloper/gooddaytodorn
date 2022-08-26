import SystemFieldProto from '../proto/system-field-proto';


export default class TaskUsersField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by task users';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.type == 'task' ? this.firstUserName(i.item) : 0],
            directions: [sort]
        }
    }

    firstUserName(task) {
        let firstId;

        if (task.actionRequiredUserId) firstId = task.actionRequiredUserId;
        else if (task.assignedToUserId) firstId = task.assignedToUserId;
        else if (task.users.length > 0) firstId = task.users[0].userId;

        if (!firstId) return '';

        return gd.session.users.get(firstId).name;
    }
}