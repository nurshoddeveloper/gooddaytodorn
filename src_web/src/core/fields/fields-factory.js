import TitleField from './system/title';
import StatusField from './system/status';
import PriorityField from './system/priority';
import ScheduleField from './system/schedule';
import DeadlineField from './system/deadline';
import TaskTypeField from './system/task-type';
import AssignedToField from './system/assigned-to';
import DateCreatedField from './system/date-created';
import LastUpdatedField from './system/last-updated';
import TaskIdField from './system/task-id';
import TaskUsersField from './system/task-users';
import TagsField from './system/tags';
import EstimateField from './system/estimate';
import ProgressBarField from './system/progress-bar';
import TimeReportedField from './system/time-reported';
import CreatedByField from './system/created-by';
import ActionRequiredField from './system/action-required';
import StartDateField from './system/start-date';
import EndDateField from './system/end-date';
//
import NumberCustomField from './custom/number/number';
import StringCustomField from './custom/string/string';
import DateCustomField from './custom/date/date';
import CurrencyCustomField from './custom/currency/currency';
import PercentageCustomField from './custom/percentage/percentage';
import BooleanCustomField from './custom/boolean/boolean';
import ListCustomField from './custom/list/list';
import RatingCustomField from './custom/rating/rating';
import EmailCustomField from './custom/email/email';
import PhoneCustomField from './custom/phone/phone';
import UrlCustomField from './custom/url/url';
import UserCustomField from './custom/user/user';

export default class FieldsFactory {

    // entityType - for system entity type i.e. project or task status
    // for custom fields, customFieldId
    static get(type, entityType = null) {

        switch (type) {
            case gd.const.fields.type.TITLE: return new TitleField(entityType);
            case gd.const.fields.type.STATUS: return new StatusField(entityType);
            case gd.const.fields.type.PRIORITY: return new PriorityField(entityType);
            case gd.const.fields.type.SCHEDULE: return new ScheduleField(entityType);
            case gd.const.fields.type.DEADLINE: return new DeadlineField(entityType);
            case gd.const.fields.type.TASK_TYPE: return new TaskTypeField(entityType);
            case gd.const.fields.type.ASSIGNED_TO: return new AssignedToField(entityType);
            case gd.const.fields.type.DATE_CREATED: return new DateCreatedField(entityType);
            case gd.const.fields.type.LAST_UPDATED: return new LastUpdatedField(entityType);
            //
            case gd.const.fields.type.TASK_ID: return new TaskIdField(entityType);
            case gd.const.fields.type.TASK_USERS: return new TaskUsersField(entityType);
            case gd.const.fields.type.TAGS: return new TagsField(entityType);
            case gd.const.fields.type.ESTIMATE: return new EstimateField(entityType);
            case gd.const.fields.type.PROGRESS_BAR: return new ProgressBarField(entityType);
            case gd.const.fields.type.TIME_REPORTED: return new TimeReportedField(entityType);
            case gd.const.fields.type.CREATED_BY: return new CreatedByField(entityType);
            case gd.const.fields.type.ACTION_REQUIRED: return new ActionRequiredField(entityType);
            case gd.const.fields.type.START_DATE: return new StartDateField(entityType);
            case gd.const.fields.type.END_DATE: return new EndDateField(entityType);
            //
            case gd.const.fields.type.CUSTOM_FIELD:
                const customField = gd.session.customFields.get(entityType);
                if (!customField) {
                    console.error('FieldsFactory: unknown custom field (' + entityType + ')');
                    return false;
                }
                return this._getCustomField(customField);

            default:
                // we expect custom field id here
                const customFieldObj = gd.session.customFields.get(type);
                if (!customFieldObj) {
                    console.error('FieldsFactory: unknown type (' + type + ')');
                    return false;
                } else {
                    return this._getCustomField(customFieldObj);
                }
        }
    }

    static _getCustomField(customField) {

        switch (customField.type) {
            case gd.const.customFields.type.NUMBER: return new NumberCustomField(customField);
            case gd.const.customFields.type.STRING: return new StringCustomField(customField);
            case gd.const.customFields.type.DATE: return new DateCustomField(customField);
            case gd.const.customFields.type.CURRENCY: return new CurrencyCustomField(customField);
            case gd.const.customFields.type.PERCENTAGE: return new PercentageCustomField(customField);
            case gd.const.customFields.type.BOOLEAN: return new BooleanCustomField(customField);
            case gd.const.customFields.type.LIST: return new ListCustomField(customField);
            case gd.const.customFields.type.RATING: return new RatingCustomField(customField);
            case gd.const.customFields.type.EMAIL: return new EmailCustomField(customField);
            case gd.const.customFields.type.PHONE: return new PhoneCustomField(customField);
            case gd.const.customFields.type.URL: return new UrlCustomField(customField);
            case gd.const.customFields.type.USER: return new UserCustomField(customField);
            default:
                console.error('FieldsFactory: unknown custom field type (' + customField.type + ')');
                return false;
                break;
        }

    }

    static getCustomFieldByType(type) {

        switch (type) {
            case gd.const.customFields.type.NUMBER: return new NumberCustomField();
            case gd.const.customFields.type.STRING: return new StringCustomField();
            case gd.const.customFields.type.DATE: return new DateCustomField();
            case gd.const.customFields.type.CURRENCY: return new CurrencyCustomField();
            case gd.const.customFields.type.PERCENTAGE: return new PercentageCustomField();
            case gd.const.customFields.type.BOOLEAN: return new BooleanCustomField();
            case gd.const.customFields.type.LIST: return new ListCustomField();
            case gd.const.customFields.type.RATING: return new RatingCustomField();
            case gd.const.customFields.type.EMAIL: return new EmailCustomField();
            case gd.const.customFields.type.PHONE: return new PhoneCustomField();
            case gd.const.customFields.type.URL: return new UrlCustomField();
            case gd.const.customFields.type.USER: return new UserCustomField();
            default:
                console.error('FieldsFactory: unknown custom field type (' + type + ')');
                return false;
                break;
        }

    }





}
