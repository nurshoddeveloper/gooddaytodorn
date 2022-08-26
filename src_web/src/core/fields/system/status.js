import SystemFieldProto from '../proto/system-field-proto';


export default class StatusField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by status';
    }

    listItemSortFunctions(sort) {
        const functionsArray = [
            (i=>{
                const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;
                let result;

                switch (i.item.systemType){
                    case WORKFOLDER:
                    case BACKLOG:
                    case SPRINT:
                    case TAG:
                        result = i.item.systemStatus;
                        break;

                    default:
                        result = gd.session.statuses.get(i.item.statusId).systemStatus;
                        break;
                }

                return result;
            }),
            (i=>{
                let result = 0;
                if (i.item.taskTypeId) {
                    let taskType = gd.session.taskTypes.get(i.item.taskTypeId);
                    if (taskType) {
                        let taskTypeStatus = taskType.statuses.getByStatusId(i.item.statusId);
                        if (taskTypeStatus) result = taskTypeStatus.sortPosition;
                    }
                }
                return result;
            }),
            (i=>{
                const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;
                const { workfolderStatusList, sprintStatusList } = gd.const.project;
                let result;

                switch (i.item.systemType){
                    case WORKFOLDER:
                    case BACKLOG:
                    case TAG:
                        result = workfolderStatusList[i.item.systemStatus];
                        break;

                    case SPRINT:
                        result = sprintStatusList[i.item.systemStatus];
                        break;

                    default:
                        result = gd.session.statuses.get(i.item.statusId).name.toLowerCase();
                        break;
                }

                return result;
            }),
        ];

        const directionsArray = [sort, sort, sort];

        return {
            functions: functionsArray,
            directions: directionsArray
        }
    }

}
