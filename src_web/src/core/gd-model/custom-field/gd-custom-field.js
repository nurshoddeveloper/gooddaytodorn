const AmpersandState = require('ampersand-state');

const GDCustomField = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        companyId: 'string',

        name: 'string',
        type: 'number',

        access: 'number',

        isDeleted: {
            type: 'boolean',
            default: false
        },

        sortPosition: 'number',
        isInherited: {
            type: 'boolean',
            default: false
        },

        params: 'object'
    },

    derived: {
        defaultValue: {
            deps: ['type'],
            fn: function() {
                const { STRING, BOOLEAN, NUMBER, CURRENCY, PERCENTAGE, DATE, LIST, RATING,
                    EMAIL, PHONE, URL, USER} = gd.const.customFields.type;
                let res = null;
                switch(this.type) {
                    case STRING:        res = "";       break;
                    case BOOLEAN:       res = false;    break;
                    case NUMBER:        res = null;     break;
                    case CURRENCY:      res = null;     break;
                    case PERCENTAGE:    res = null;     break;
                    case DATE:          res = null;     break;
                    case LIST:          res = null;     break;
                    case RATING:        res = null;     break;
                    case EMAIL:         res = null;     break;
                    case PHONE:         res = null;     break;
                    case URL:           res = null;     break;
                    case USER:          res = null;     break;
                }

                return res;
            }
        },

        valueType: {
            deps: ['type'],
            fn: function() {
                const { STRING, BOOLEAN, NUMBER, CURRENCY, PERCENTAGE, DATE, LIST, RATING,
                    EMAIL, PHONE, URL, USER} = gd.const.customFields.type;
                let res = null;
                switch(this.type){
                    case STRING:        res = "string";       break;
                    case BOOLEAN:       res = "boolean";      break;
                    case NUMBER:        res = "float";        break;
                    case CURRENCY:      res = "float";        break;
                    case PERCENTAGE:    res = "float";        break;
                    case DATE:          res = "string";       break;
                    case LIST:          res = "float";        break;
                    case RATING:        res = "float";        break;
                    case EMAIL:         res = "string";       break;
                    case PHONE:         res = "string";       break;
                    case URL:           res = "string";       break;
                    case USER:          res = "string";       break;
                }

                return res;
            }
        },

        typeName: {
            deps: ['type'],
            fn: function() {
                const { STRING, BOOLEAN, NUMBER, CURRENCY, PERCENTAGE, DATE, LIST, RATING,
                    EMAIL, PHONE, URL, USER} = gd.const.customFields.type;
                let res = null;
                switch(this.type){
                    case STRING:        res = "string";         break;
                    case BOOLEAN:       res = "boolean";        break;
                    case NUMBER:        res = "number";         break;
                    case CURRENCY:      res = "currency";       break;
                    case PERCENTAGE:    res = "percentage";     break;
                    case DATE:          res = "date";           break;
                    case LIST:          res = "list";           break;
                    case RATING:        res = "rating";         break;
                    case EMAIL:         res = "email";          break;
                    case PHONE:         res = "phone";          break;
                    case URL:           res = "url";            break;
                    case USER:          res = "user";           break;
                }

                return res;
            }
        },

        icon: {
            deps: ['type'],
            fn: function() {
                return gd.const.customFields[this.type].icon;
            }
        },

        // not in use experimental shit
        listColumnWidth: {
            deps: ['type','name'],
            fn: function() {

                let defaultWidth = 100;

                switch(this.type) {

                    case gd.const.customFields.type.CURRENCY:
                    case gd.const.customFields.type.DATE:
                    case gd.const.customFields.type.LIST:
                        defaultWidth = 100;
                        break;

                    case gd.const.customFields.type.EMAIL:
                        defaultWidth = 180;
                        break;

                    case gd.const.customFields.type.STRING:
                    case gd.const.customFields.type.PHONE:
                    case gd.const.customFields.type.URL:
                    case gd.const.customFields.type.USER:
                        defaultWidth = 160;
                        break;
                    case gd.const.customFields.type.BOOLEAN:
                    case gd.const.customFields.type.NUMBER:
                    case gd.const.customFields.type.PERCENTAGE:
                        defaultWidth = 90;
                        break;

                    case gd.const.customFields.type.RATING:
                        defaultWidth = 110;
                        break;
                }
                const titleWidth = this.getTitleWidth();

                if (titleWidth + 30 > defaultWidth) {
                    defaultWidth = titleWidth + 30;
                }

                return defaultWidth;
            }
        }
    },

    getTitleWidth() {

        const symbols = this.name.length;

        if (symbols<=6) return 50;
        if (symbols<=10) return 75;
        if (symbols<=15) return 110;
        return 120;
    },

    clone() {
        return new GDCustomField(this.toJSON());
    },

    setInherited(value) {
        this.isInherited = value;
    }
});

module.exports = GDCustomField;