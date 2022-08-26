import FieldProto from './field-proto';

export default class SystemFieldProto extends FieldProto {

    constructor(entityType) {
        super();
        this.entityType = entityType;
    }

}
