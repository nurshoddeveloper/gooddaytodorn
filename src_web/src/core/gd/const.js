module.exports = {

    project: require('./const/project.js'),
    fields: require('./const/fields.js'),
    customFields: require('./const/custom-fields.js'),

    help: require('./const/help.js'),
    video: require('./const/videos.js'),

    company: require('./const/company.js'),
    defaultView: require('./const/default-view.js'),
    views: require('./const/views.js'),


    bigScreen: require('./const/big-screen.js'),

    task: require('./const/task.js'),

    event: require('./const/event.js'),

    /*scheduleStatus: {
        NOT_SCHEDULED: 0,
        SCHEDULED: 1,
        SOMEDAY: 2
    },*/

    attachment: {

        fileType: {
            OTHER: 0,
            IMAGE: 1,
            DOCUMENT: 2,
            GOOGLE_DOCUMENT: 12,
            WEB: 3,
            ARCHIVE: 4,
            SOURCE_CODE: 5,
            VIDEO: 6,
            AUDIO: 7,
            THREED: 8,
            GRAPHIC_SOURCE: 9,
            FONT: 10,
            EBOOK: 11
        },

        googleDriveMimes: {
            DOCUMENT:       'application/vnd.google-apps.document',
            SPREADSHEET:    'application/vnd.google-apps.spreadsheet',
            DRAWING:        'application/vnd.google-apps.drawing',
            FORM:           'application/vnd.google-apps.form',
            PRESENTATION:   'application/vnd.google-apps.presentation',
        },

        preview: {
            UNKNOWN: 0,
            AVAILABLE: 1,
            NOT_AVAILABLE: 2,
        }

    },

    /*
    // obsolete, use gd.const.views.*
    board: {

        type: {
            TEAMBOARD: 1,
            TASKS_PLANNING: 2,
            PRIORITIES: 3,
            ACTIVE_PROJECTS: 4,
            TASKS_BY_USER: 5,
            ALL_TASKS_BOARD: 6,
            EVENTS_SUMMARY: 7,
            WHATS_DONE: 8,
            WORKLOAD: 9,
            PASTDUE: 10,

            TASK_LIST: 12,
            TASK_TABLE: 13,
            BOARD: 14,
            TIMELINE: 15,
            SUMMARY: 16,
            CALENDAR: 17,
            FILES: 18
        },

        url: {
            1: 'team',
            2: 'tasks-planning',
            3: 'priorities',
            4: 'active-projects',
            5: 'tasks-by-user',
            6: 'organization-tasks',
            7: 'events-summary',
            8: 'what-is-done',
            9: 'workload',
            10: 'pastdue'
        },

        list: {
            //1: 'Teamboard',
            2: 'Tasks planning',
            5: 'Tasks by user',
            3: 'Priorities',
            4: 'Active Projects',
            6: 'All tasks / Board',
            7: 'Events summary',
            8: 'What\'s done',
            // 9: 'Resource planning',
            10: 'Past due'
        }
    },*/

    systemStatus: {
        NOT_STARTED: 1,
        IN_PROGRESS: 2,
        IN_REVIEW: 3,
        ON_HOLD: 4,
        COMPLETED: 5,
        CANCELLED: 6,

        isOpen: function(systemStatus){
            return (systemStatus>0 && systemStatus<5)
        },

        isClosed: function(systemStatus) {
            return (systemStatus==5 || systemStatus==6)
        },

        OPEN_STATUSES: [1,2,3,4],
        CLOSED_STATUSES: [5,6]
    },

    systemStatusList: {
        1: 'Not started',
        2: "In progress",
        3: "In review",
        4: "On hold",
        5: "Closed / Archived",
        6: "Cancelled"
    },

    statusColor: {
        LIGHT_LIGHT_BLUE: 1,
        LIGHT_BLUE: 2,
        BLUE: 3,
        DARK_BLUE: 4,
        GREEN: 5,
        LIGHT_GREEN: 6,
        RED: 7,
        PINK: 8,
        ORANGE: 9,
        VIOLET: 10,
        GRAY: 11,
        LIGHT_GRAY: 12
    },

    statusColorValue: {
        1: '#71c8e4',
        2: '#42bce4',
        3: '#4b9fed',
        4: '#4f7ee8',
        5: '#53c23d',
        6: '#6cd957',
        7: '#f3526a',
        8: '#f45aa6',
        9: '#fbb02d',
        10: '#a654dc',
        11: '#78909c',
        12: '#b0bec5'
    },

    reminder: {
        type: {
            LINK: 1,
            MESSAGE: 2
        }
    },


    dashboard: {

        type: {
            EVENTS: 11,
            BEHAVIOUR: 12,
            PROJECTS_USERS: 13,
            COMPANY: 14,
            PROJECT: 15,
            USER: 16
        },

        behaviour: {
            SELF_ORGANIZATION: 1
        }


    },


    emailNotificationFrequency: {
        0: "Immediately (no grouping)",
        15: "Every 15 minutes",
        60: "Every Hour",
        120: "Every 2 hours",
        180: "Every 3 hours",
        240: "Every 4 hours",
        360: "Every 6 hours",
        480: "Every 8 hours",
        720: "Every 12 hours",
        1440: "Once a day"
    },

    myTime: {

        minTaskTime: 5

    },

    report: {

        durationList: {
            7: 'Weekly',
            14: '2 Weeks',
            30: 'Monthly'
        },

        reportType :{
            COMPANY_USER: 1,
            PROJECT: 2,
            COMPANY: 3,
            DEPARTMENT: 4
        }

    },



    presence: {
        DISCONNECTED: 0,
        CONNECTING: 1,
        CONNECTED: 2
    },

    companyRole: {
        CLIENT: 1,
        GUEST: 2,
        USER: 3,
        MANAGER: 4
    },

    companyRoleList: {
        1: 'Client',
        2: 'Guest',
        3: 'User',
        4: 'Manager'
    },


    recent: {
        task: 1,
        project: 2
    },

    taskMessage: {

        type: {
            FIRST:              1,
            MESSAGE:            2,
            NO_REPLY:           3,

            REASSIGN:           10,     // manual reassing

            PRIORITY:           11,
            SET_DEADLINE:       12,
            CHANGE_DEADLINE:    13,
            REMOVE_DEADLINE:    14,
            ESTIMATE:           15,
            MOVE:               16,
            AUTO_REASSIGN:      17,     // auto reassign

            TIME_REPORT:        18,
            AR_CHANGE:          19,

            SCHEDULE_DATE:      20,
            SCHEDULE_SOMEDAY:   21,
            START_END:          22,

            VIEW:               30,
            ADD_USER:           31
        },

        // THIS BROKEN I THINK !!! ToDo:
        typeList: {

            1: 'CREATED',
            2: 'REPLY',
            3: 'COMMENT',

            10: 'SCHEDULE_DATE',
            11: 'SCHEDULE_SOMEDAY',
            12: 'VIEW',
            13: 'NO_REPLY',

            20: 'REASSIGN',
            21: 'PRIORITY',
            22: 'AR_CHANGE',
            23: 'SET_DEADLINE',
            24: 'CHANGE_DEADLINE',
            25: 'REMOVE_DEADLINE',

            40: 'TO_REVIEW',
            41: 'CLOSED',
            42: 'CANCELED',
            43: 'REOPEN',
            44: 'STATUS_CHANGED'
        },

        sysTypeList: {
            1: 'FIRST',
            3: 'COMMENT',
            4: 'INTERRUPT',
            5: 'GETBACK ',
            6: 'NEW_USER',
            7: 'SWITCH',
            8: 'NO_REPLY',
            9: 'RESET_AR',
            10: 'SYSTEM '
        }

    },

    companyUser: {

        workDayDurationList: {
            0: 'Flexible',
            30: '½ hour',
            60: '1 hour',
            90: '1½ hours',
            120: '2 hours',
            150: '2½ hours',
            180: '3 hours',
            210: '3½ hours',
            240: '4 hours',
            270: '4½ hours',
            300: '5 hours',
            330: '5½ hours',
            360: '6 hours',
            390: '6½ hours',
            420: '7 hours',
            450: '7 ½ hours',
            480: '8 hours',
            510: '8½ hours',
            540: '9 hours',
            570: '9½ hours',
            600: '10 hours',
            630: '10½ hours',
            660: '11 hours',
            690: '11½ hours',
            720: '12 hours'
        },

        maxPastDueList: {
            24: '1 day',
            48: '2 days',
            72: '3 days',
            96: '4 days',
            120: '5 days',
            144: '6 days',
            168: '1 week'
        },

        requiredReportTime: {
            0: '0 hours',
            30: '½ hour',
            60: '1 hour',
            90: '1½ hours',
            120: '2 hours',
            150: '2½ hours',
            180: '3 hours',
            210: '3½ hours',
            240: '4 hours',
            270: '4½ hours',
            300: '5 hours',
            330: '5½ hours',
            360: '6 hours',
            390: '6½ hours',
            420: '7 hours',
            450: '7½ hours',
            480: '8 hours',
            510: '8½ hours',
            540: '9 hours',
            570: '9½ hours',
            600: '10 hours',
            630: '10½ hours',
            660: '11 hours',
            690: '11½ hours',
            720: '12 hours'
        }


    },

    myWork: {

        type: {
            TASK: 1,
            EVENT: 2,
            MOM: 3,
            REPORT: 4,
            REMINDER: 6,
            RATE_EXPERIENCE: 8
        },

        group: {
            INBOX: "inbox",
            TODAY: "today",
            SOMEDAY: "someday",
            PASTDUE: "pastdue",
            DAY: "day-"
        },

        viewType: {
            // SCHEDULE: "schedule",
            // PROJECT: "project",
            // FROM_USER: "fromUser",
            ACTION_REQUIRED: "actionRequired",
            ASSIGNED_TO_ME: "assigned",
            ALL_INVOLVED: "involved",
        }

        // viewType: {
        //     SCHEDULE: "schedule",
        //     PROJECT: "project",
        //     FROM_USER: "fromUser",
        //     ACTION_REQUIRED: "actionRequired",
        //     ASSIGNED_TO_ME: "assignedToMe",
        //     ALL_INVOLVED: "allInvolved",
        // }
    },

    alphabetColors: {
        a: 'e06055',
        b: 'f06292',
        c: 'bb68c7',
        d: '9575cd',
        e: '7986cb',
        f: '5e96f5',
        g: '3db1e4',
        h: '44bece',
        i: '4cb6ac',
        j: '56bb8a',
        k: '9ccc65',
        l: 'bacb20',
        m: 'eec247',
        n: 'eec247',
        o: 'fdaa31',
        p: 'f9815b',
        q: '959494',
        r: '8699a3',
        s: '9b837b',
        t: '8699a3',
        u: '7086cc',
        v: 'b39cda',
        w: '9d9d9d',
        x: '44bece',
        y: '9b837b',
        z: 'a9cc65',

        1: 'e06055',
        2: 'f06292',
        3: 'bb68c7',
        4: '9575cd',
        5: '7986cb',
        6: '5e96f5',
        7: '3db1e4',
        8: '44bece',
        9: '4cb6ac',
        0: '56bb8a'
    },

    priority:{
        levels: {
            emergency: 100,
            blocker: 50
        },
        colors: {
            1: 'cccccc',
            2: 'b6b6b7',
            3: 'a1a1a3',
            4: '8c8c8f',
            5: '78787b',
            6: 'f5bc35',
            7: 'f4a235',
            8: 'f18835',
            9: 'ec5f34',
            10: 'e94a33',
            50: 'e94a33',
            100: 'e94a33'
        }
    },

    tasksGroupBy: {
        none: "",
        scheduleDate: "scheduleDate",
        recentDate: "recentDate"
    },

    taskEstimate: {
        15: '15 min',
        30: '30 min',
        45: '45 min',
        60: '1 hour',
        90: '1½ hours',
        120: '2 hours',
        150: '2½ hours',
        180: '3 hours',
        210: '3½ hours',
        240: '4 hours',
        270: '4½ hours',
        300: '5 hours',
        330: '5½ hours',
        360: '6 hours',
        390: '6½ hours',
        420: '7 hours',
        450: '7 ½ hours',
        480: '8 hours',
        510: '8½ hours',
        540: '9 hours',
        570: '9½ hours',
        600: '10 hours',
        630: '10½ hours',
        660: '11 hours',
        690: '11½ hours',
        720: '12 hours',

        1440: '1 day',
        2880: '2 days',
        4320: '3 days',
        5760: '4 days',
        7200: '5 days',
        8640: '6 days',
        10080: '1 week'
    },

    taskView: {
        current: 'current'
    },

    taskSystemType: {
        TASK: 1,
        SUBTASK: 2,
        PROJECT: 3
    },

    busEvents: {
        tasksListNew: 'tasks-list-new',
        tasksListDelete: 'tasks-list-delete',
        tasksListChange: 'tasks-list-change'
    },

    gantt: {
        linkTypes: {
            LINKED: 1,
            FINISH_START: 5,
            START_START: 6,
            FINISH_FINISH: 7,
            START_FINISH: 8,
        }
    },

    currency: {
        us_dollar:              { label: "US Dollar, $",                value: "us_dollar",             symbol: "$"},
        euro:                   { label: "Euro, €",                     value: "euro",                  symbol: "€" },
        pound_sterling:         { label: "Pound Sterling, £",           value: "pound_sterling",        symbol: "£" },
        arab_emirates_dirham:   { label: "Arab Emirates Dirham, dh",    value: "arab_emirates_dirham",  symbol: "dh" },
        argentine_peso:         { label: "Argentine Peso, $",           value: "argentine_peso",        symbol: "$" },
        brazilian_real:         { label: "Brazilian Real, R$",          value: "brazilian_real",        symbol: "R$" },
        canadian_dollar:        { label: "Canadian Dollar, $",          value: "canadian_dollar",       symbol: "$" },
        chilean_peso:           { label: "Chilean Peso, $",             value: "chilean_peso",          symbol: "$" },
        colombian_peso:         { label: "Colombian Peso, $",           value: "colombian_peso",        symbol: "$" },
        czech_koruna:           { label: "Czech Koruna, Kč",            value: "czech_koruna",          symbol: "Kč" },
        danish_crone:           { label: "Danish Krone, kr",            value: "danish_crone",          symbol: "kr" },
        hong_kong_dollar:       { label: "Hong Kong Dollar, HK$",       value: "hong_kong_dollar",      symbol: "HK$" },
        hungarian_forint:       { label: "Hungarian Forint, Ft",        value: "hungarian_forint",      symbol: "Ft" },
        indian_rupee:           { label: "Indian Rupee, ₹",             value: "indian_rupee",          symbol: "₹" },
        indonesian_rupiah:      { label: "Indonesian Rupiah, Rp",       value: "indonesian_rupiah",     symbol: "Rp" },
        izrael_new_shekel:      { label: "Israeli New Shekel, ₪",      value: "izrael_new_shekel",     symbol: "₪" },
        japanese_yen:           { label: "Japanese Yen, ¥",             value: "japanese_yen",          symbol: "¥" },
        korean_won:             { label: "Korean Won, ₩",              value: "korean_won",            symbol: "₩" },
        malasyan_ringgit:       { label: "Malaysian Ringgit, RM",       value: "malasyan_ringgit",      symbol: "RM" },
        mexican_peso:           { label: "Mexican Peso, $",             value: "mexican_peso",          symbol: "$" },
        new_zealand_dollar:     { label: "New Zealand Dollar, $",       value: "new_zealand_dollar",    symbol: "$" },
        norwegian_crone:        { label: "Norwegian Krone, kr",         value: "norwegian_crone",       symbol: "kr" },
        peruvian_nuevo_sol:     { label: "Peruvian Nuevo Sol, S/.",     value: "peruvian_nuevo_sol",    symbol: "S/." },
        philippine_peso:        { label: "Philippine Peso, ₱",          value: "philippine_peso",       symbol: "₱" },
        polish_zloty:           { label: "Polish Zloty, zł",            value: "polish_zloty",          symbol: "zł" },
        romanian_new_leu:       { label: "Romanian New Leu, lei",       value: "romanian_new_leu",      symbol: "lei" },
        russian_rouble:         { label: "Russian Ruble, руб.",         value: "russian_rouble",        symbol: "руб." },
        saudi_riyal:            { label: "Saudi Riyal, Rial",           value: "saudi_riyal",           symbol: "Rial" },
        singapore_dollar:       { label: "Singapore Dollar, $",         value: "singapore_dollar",      symbol: "$" },
        south_african_rand:     { label: "South African Rand, R",       value: "south_african_rand",    symbol: "R" },
        swedish_krona:          { label: "Swedish Krona, kr",           value: "swedish_krona",         symbol: "kr" },
        swiss_franc:            { label: "Swiss Franc, CHF",            value: "swiss_franc",           symbol: "CHF" },
        taiwan_dollar:          { label: "Taiwan Dollar, NT$",          value: "taiwan_dollar",         symbol: "NT$" },
        thai_baht:              { label: "Thai Baht, ฿",                value: "thai_baht",             symbol: "฿" },
        turkish_lira:           { label: "Turkish Lira, TRY",           value: "turkish_lira",          symbol: "TRY" },
        ukraine_hryvnia:        { label: "Ukraine Hryvnia, ₴",          value: "ukraine_hryvnia",       symbol: "₴" },
        vietnamese_dong:        { label: "Vietnamese Dong, ₫",          value: "vietnamese_dong",       symbol: "₫" },
        yuan_renminbi:          { label: "Yuan Renminbi, ¥",            value: "yuan_renminbi",         symbol: "¥" }
    },

    // bigScreen: {
    //
    //     type: {
    //         EVENTS_CALENDAR: 1,
    //         EVENTS_SUMMARY: 4,
    //
    //         EXTERNAL_URI: 2,
    //         TODAY_TASKS: 3,
    //         ACTIVE_PROJECTS: 5,
    //         TEAM_BOARD: 6,
    //         HIGH_PRIORITIES: 7,
    //         TASKS_BOARD_SYSTEM: 8,
    //         PROJECT_SUMMARY: 9,
    //         TASKS_BOARD_BY_USER : 10,
    //
    //         THANK_YOU: 11
    //     },
    //
    //     list: {
    //         7: 'Priorities',
    //         10: 'Tasks by user',
    //         11: 'Thank you'
    //     }
    // },

    communicationFlow: {
        FIRST: 1,       // First - first message in a flow task A .... or reopen (new block)
        COMMENT: 2,     // Comment - some one comments (without changing AR user) A-(comment)->B
        GET_BACK: 3,    // Get Back - ar change to previous user i.e. A->B->A
        SWITCH: 4,      // Switch  - ar change to other user i.e. A->B->C
        INTERRUPT: 5,   // Interrupt - ar changed by not ar user i.e. A->B C->A
        NO_REPLY: 6     // No reply - ar was changed and original ar user had no chance to reply A->B-(no reply)-C->A (always comes with interrupt)
    },

    storageProvider: {
        LOCAL: 0,
        GOOGLE_DRIVE: 100
    },

    projectHistory: {
        CREATED: 1,
        STATUS_UPDATE: 2,
        CLOSED: 3
    },

    eventHistory: {
        CREATED: 1,
        DATE_CHANGED: 2,
        ACCOMPLISHED: 3,
        NOT_ACCOMPLISHED: 4,
        REASSIGNED: 5
    },

    dependenciesUpdateTypes: {
        NO_CHANGES: 'no-changes',
        NO_INTERSECTIONS: 'no-intersections',
        SAME_SPACES: 'same-spaces'
    },

    suggestedStatuses: [
        // {
        //     id: "new_suggested",
        //     name: "New",
        //     description: 'Just created',
        //     systemStatus: 1,
        //     color: 1
        // },{
        //     id: "in_progress_suggested",
        //     name: "In progress",
        //     description: 'Work in progress',
        //     systemStatus: 2,
        //     color: 2
        // },{
        //     id: "on_hold_suggested",
        //     name: "On hold",
        //     description: 'Work on hold',
        //     systemStatus: 4,
        //     color: 10
        // },

        // NEW
        {
            id: "new_suggested",
            name: "New",
            description: '',
            systemStatus: 1,
            color: 2
        },
        {
            id: "not_started_suggested",
            name: "Not started",
            description: '',
            systemStatus: 1,
            color: 2
        },
        {
            id: "planning_suggested",
            name: "Planning",
            description: '',
            systemStatus: 1,
            color: 2
        },
        {
            id: "kickoff_suggested",
            name: "Kick-Off",
            description: '',
            systemStatus: 1,
            color: 2
        },


        // IN PROGRESS
        {
            id: "open_suggested",
            name: "Open",
            description: '',
            systemStatus: 2,
            color: 5
        },
        {
            id: "in_progress_suggested",
            name: "In Progress",
            description: '',
            systemStatus: 2,
            color: 5
        },
        {
            id: "active_suggested",
            name: "Active",
            description: '',
            systemStatus: 2,
            color: 5
        },

        {
            id: "draft_suggested",
            name: "Draft",
            description: '',
            systemStatus: 2,
            color: 5
        },
        {
            id: "design_suggested",
            name: "Design",
            description: '',
            systemStatus: 2,
            color: 5
        },
        {
            id: "development_suggested",
            name: "Development",
            description: '',
            systemStatus: 3,
            color: 5
        },
        {
            id: "rejected_suggested",
            name: "Rejected",
            description: '',
            systemStatus: 3,
            color: 7
        },



        // REVIEW

        {
            id: "review_suggested",
            name: "Review",
            description: '',
            systemStatus: 3,
            color: 9
        },
        {
            id: "completed_suggested",
            name: "Completed",
            description: '',
            systemStatus: 3,
            color: 9
        },
        {
            id: "approval_suggested",
            name: "Approval",
            description: '',
            systemStatus: 3,
            color: 9
        },
        {
            id: "testing_suggested",
            name: "Testing",
            description: '',
            systemStatus: 3,
            color: 9
        },
        {
            id: "resolved_suggested",
            name: "Resolved",
            description: '',
            systemStatus: 3,
            color: 9
        },

        // ON HOLD
        {
            id: "on_hold_suggested",
            name: "On hold",
            description: '',
            systemStatus: 4,
            color: 10
        },
        {
            id: "pending_suggested",
            name: "Pending",
            description: '',
            systemStatus: 4,
            color: 10
        },

        // CLOSED & cancelled
        {
            id: "archived_suggested",
            name: "Archived",
            description: '',
            systemStatus: 5,
            color: 11
        },
        {
            id: "closed_suggested",
            name: "Closed",
            description: '',
            systemStatus: 5,
            color: 11
        },
        {
            id: "cancelled_suggested",
            name: "Cancelled",
            description: '',
            systemStatus: 6,
            color: 11
        }
    ],

    taskTypeSettings: {
        actionRequired: {
            ALLOWED: 'allowed',
            DENIED_ON_REPLY: 'denied_on_reply',
            ALWAYS_REQUIRED: 'always_required',
        }
    },

    entityType: {
        TASK: 'task',
        PROJECT: 'project'
    }
};