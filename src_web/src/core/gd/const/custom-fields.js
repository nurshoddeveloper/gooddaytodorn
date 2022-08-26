module.exports = {

    type: {
        STRING: 1,
        BOOLEAN: 2,
        NUMBER: 3,
        CURRENCY: 4,
        PERCENTAGE: 5,
        DATE: 6,
        LIST: 7,
        RATING: 8,
        EMAIL: 9,
        PHONE: 10,
        URL: 11,
        USER: 12
    },

    list: [
        1,2,3,4,5,6,7,8,9,10,11,12
    ],

    // STRING
    1: {
        id: 1,
        label: 'Text',
        icon: 'gd-icon-field-text'
    },

    // BOOLEAN
    2: {
        id: 2,
        label: 'Checkbox',
        icon: 'gd-icon-field-checkbox'
    },

    // NUMBER
    3: {
        id: 3,
        label: 'Number',
        icon: 'gd-icon-field-numbers'
    },

    // CURRENCY
    4: {
        id: 4,
        label: 'Currency',
        icon: 'gd-icon-field-currency'
    },

    // PERCENTAGE
    5: {
        id: 5,
        label: 'Percentage',
        icon: 'gd-icon-field-percentage'
    },

    // DATE
    6: {
        id: 6,
        label: 'Date',
        icon: 'gd-icon-calendar'
    },

    // LIST
    7: {
        id: 7,
        label: 'Dropdown',
        icon: 'gd-icon-list'
    },

    // RATING
    8: {
        id: 8,
        label: 'Rating',
        icon: 'gd-icon-star'
    },

    // EMAIL
    9: {
        id: 9,
        label: 'Email',
        icon: 'gd-icon-email'
    },
    // EMAIL
    10: {
        id: 10,
        label: 'Phone',
        icon: 'gd-icon-phone'
    },

    // URL
    11: {
        id: 11,
        label: 'Link',
        icon: 'gdt-globe'
    },

    // USER
    12: {
        id: 12,
        label: 'User',
        icon: 'gd-icon-user'
    },

    label: {
        1: 'Text',
        STRING: 'Text',

        2: 'Checkbox',
        BOOLEAN: 'Checkbox',

        3: 'Number',
        NUMBER: 'Number',

        4: 'Currency',
        CURRENCY: 'Currency',

        5: 'Percentage',
        PERCENTAGE: 'Percentage',

        6: 'Date',
        DATE: 'Date',

        7: 'Dropdown',
        LIST: 'Dropdown',
    },

    icon: {
        1: 'gd-icon-field-text',
        STRING: 'gd-icon-field-text',

        2: 'gd-icon-field-checkbox',
        BOOLEAN: 'gd-icon-field-checkbox',

        3: 'gd-icon-field-numbers',
        NUMBER: 'gd-icon-field-numbers',

        4: 'gd-icon-field-currency',
        CURRENCY: 'gd-icon-field-currency',

        5: 'gd-icon-field-percentage',
        PERCENTAGE: 'gd-icon-field-percentage',

        6: 'gd-icon-calendar',
        DATE: 'gd-icon-calendar',

        7: 'gd-icon-list',
        LIST: 'gd-icon-list',
    },

    access: {
        EVERYONE: 1, //gd.const.companyRole.CLIENT,
        MANAGERS_ONLY: 4, //gd.const.companyRole.MANAGER
    },

    accessLabel: {
        EVERYONE: 'Everyone',
        MANAGERS_ONLY: 'Managers only',
    },


};