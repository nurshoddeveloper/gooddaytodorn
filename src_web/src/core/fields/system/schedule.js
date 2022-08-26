import Moment from 'moment';
import SystemFieldProto from '../proto/system-field-proto';


export default class ScheduleField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by schedule';
    }

    listItemSortFunctions(sort) {
        const sortFunc = i => {
            if (i.type === 'project') return 0;
            const { scheduleDate, scheduleStatus } = i.item;
            let out;
            if (scheduleStatus === 0)      out = 0;
            else if (scheduleDate)         out = scheduleDate.unix();
            else if (scheduleStatus === 2) out = scheduleStatus === 2 ? Moment().startOf('day').add(100, 'years').unix() : 0;
            return out;
        };

        return {
            functions: [sortFunc],
            directions: [sort]
        }
    }
}