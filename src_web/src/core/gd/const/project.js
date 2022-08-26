module.exports = {

    type: {
        PROJECT: 1,

        WORKFOLDER: 2,      // old
        FOLDER: 2,          // new

        BACKLOG: 3,
        SPRINT: 4,
        TAG: 5
    },

    typeList: {
        1: 'Project',
        2: 'Folder',
        3: 'Backlog',
        4: 'Sprint',
        5: 'Tag'
    },

    typeIcon: {
        1: 'gd-icon-project',
        2: 'gd-icon-open-folder',
        3: 'gd-icon-someday',
        4: 'gd-icon-sprint',
        5: 'gd-icon-tag'
    },

    access: {
        LIMITED: 1,
        STANDARD: 2,
        FULL: 3
    },

    accessList: {
        1: 'Limited',
        2: 'Standard',
        3: 'Full'
    },

    role: {
        CLIENT: 1,
        GUEST: 2,
        USER: 3,
        PROJECT_MANAGER: 4,
        OWNER: 5
    },

    workfolderStatus: {
        OPEN: 2,
        CLOSED: 5
    },

    workfolderStatusList: {
        2: 'Open',
        5: 'Archived'
    },

    sprintStatus: {
        NOT_STARTED: 1,
        IN_PROGRESS: 2,
        IN_REVIEW: 3,
        COMPLETED: 5
    },

    sprintStatusList: {
        1: 'Planning',
        2: 'Active',
        3: 'Review',
        5: 'Closed'
    },

    color: {
        1: 'd66258',
        2: 'd46385',
        3: 'b272b8',
        4: '9379c7',
        5: '768acb',
        6: '609dea',
        7: '38afd6',
        8: '33b8c4',
        9: '3ab5ad',
        10: '48b98b',
        11: '65c26e',
        12: '8fbd5e',
        13: '668a3f',
        14: 'e0a848',
        15: 'f09956',
        16: 'e37c5d',
        17: '949495',
        18: '8499a3',
        19: '9d837b',
        20: '5e89b8',
        21: '5f7ab8',
        22: '9880c4',
        23: '70767e',
        24: '8187b8',
        25: '585d85',
        26: 'e0696b'
    },


    userInheritance: {
        MANUAL: 0,
        INHERITED: 1,
        UPHERITED: 2
    },

    icon: {
        folder: "gdt-open-folder", open_folder: "gdt-open-folder",
        project: "gdt-project",
        dev: "gdt-project-dev",
        sprint: "gdt-sprint",
        backlog: "gdt-someday", someday_3: "gdt-someday",
        tag: "gdt-tag",
        kanban: "gdt-kanban",
        scrum: "gdt-agile",
        files: "gdt-documents",

        mobile: "gdt-device-mobile",
        desktop: "gdt-device-desktop",


        support: "gdt-support",
        requests: "gdt-archive", archive: "gdt-archive",


        api: "gdt-api",
        qa: "gdt-qa",

        bug: "gdt-bug",

        rocket: "gdt-rocket",
        megaphone: "gdt-megaphone",
        idea: "gdt-idea",
        book: "gdt-book",

        paint: "gdt-paint-bucket",

        money: "gdt-money",
        contact: "gdt-contact",
        leads: "gdt-leads",



        calendar: "gdt-calendar",
        cloud: "gdt-cloud",
        home: "gdt-home",
        mail_black: "gdt-mail-black",
        projection_screen: "gdt-projection-screen",

        android: "gdt-social-android", social_android: "gdt-social-android",
        apple: "gdt-social-apple", social_apple: "gdt-social-apple",
        windows: "gdt-social-windows", social_windows: "gdt-social-windows",

        education: "gdt-graduation", graduation_cap: "gdt-graduation",
        assets: "gdt-assets",

        event: "gdt-event",

        img: "gdt-image",
        inventory: "gdt-inventory",
        userSearch: "gdt-user-search",

        target: 'gdt-target',
        taskList: 'gdt-task-list',
        aim: 'gdt-aim',
        request: 'gdt-request',
        request2: 'gdt-request2',

        twitter: 'gdt-social-twitter',



    },

    iconList: [
        'folder', 'project', 'dev', 'taskList', 'sprint', 'scrum', 'backlog', 'kanban', 'files',

        'mobile', 'desktop', 'api', 'qa', 'bug',

        'support', 'requests',

        'rocket', 'megaphone', 'idea', 'book', 'education', 'assets', 'event',

        'paint', 'inventory',

        'money', 'contact', 'userSearch', 'img',

        'leads', 'target', 'aim', 'request', 'request2',


        // other old

        'calendar', 'cloud', 'home', 'mail_black', 'projection_screen',

        'twitter', 'android', 'apple', 'windows',
    ]
};