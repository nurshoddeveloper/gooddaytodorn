import FieldProto from './field-proto';

export default class CustomFieldProto extends FieldProto {

    constructor(customField) {
        super();
        this.customField = customField;
    }

    get sortHintMessage() {
        return 'Sort by ' + this.customField.name;
    }

    get systemIcon() {
        return gd.const.customFields[this.customField.type].icon;
    }

    get systemTypeName() {
        return gd.const.customFields[this.customField.type].label;
    }

    get groupLabel() {
        return this.customField.name;
    }

    get groupInfo() {
        return 'Group by ' + this.customField.name;
    }

    getGroupObject(value) {
        return {
            id: value,
            customFieldId: this.customField.id,
            value: value
        }
    }
}
