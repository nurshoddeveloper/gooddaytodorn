import Moment from 'moment';
import SystemFieldProto from '../proto/system-field-proto';


export default class DeadlineField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by deadline';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => {
                const { deadline } = i.item;
                return deadline ? deadline.unix() : Moment('1900-01-01 00:00:00').unix();
            }],
            directions: [sort]
        }
    }
}