import Moment from 'moment';
import SystemFieldProto from '../proto/system-field-proto';


export default class StartDateField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by start date';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => Moment(i.item.startDate || '1900-01-01 00:00:00').unix()],
            directions: [sort]
        }
    }
}