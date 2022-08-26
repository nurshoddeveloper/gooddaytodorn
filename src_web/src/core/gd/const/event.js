module.exports = {



    type: {
        PROJECT_EVENT: 1,
        PROJECT_MILESTONE: 2,
        PROJECT_DEADLINE: 3,
        PROJECT_CREATED: 4,
        PROJECT_PAYMENT: 5,

        COMPANY_EVENT: 10,
        COMPANY_HOLIDAY: 11,

        PERSONAL_PAID_VACATION: 20,
        PERSONAL_NON_PAID_VACATION: 21,
        PERSONAL_SICK_LEAVE: 22,
        PERSONAL_TRAVEL: 24,
        PERSONAL_EXTRA_WORK_DAY: 23,

        TASK_DEADLINE: 30,
    },


    1: { name: 'Project event',         icon: 'gd-icon-event-project-event',            description: 'A generic project event which may span several days' },
    2: { name: 'Project milestone',     icon: 'gd-icon-event-project-milestone',        description: 'An important deliverable or progress point related to a project / folder' },
    3: { name: 'Project deadline',      icon: 'gd-icon-event-project-deadline',  description: 'Project deadline' },
    4: { name: 'Project created',       icon: 'gd-icon-event-project-created',  description: 'Project created' },
    5: { name: 'Project payment',       icon: '',  description: 'Payment milestone' },

    10: { name: 'Organization event',         icon: 'gd-icon-organization',            description: 'A company event that is important to all team members' },
    11: { name: 'Holiday',     icon: 'gd-icon-event-company-holiday',        description: 'Statutory holiday, company-wide day off or holiday break' },

    20: { name: 'Vacation',     icon: 'gd-icon-event-personal-vacation',        description: 'Personal vacation time' },
    22: { name: 'Sick leave',     icon: 'gd-icon-event-personal-sick-leave',        description: 'Time away from work due to illness' },
    24: { name: 'Travel',     icon: 'gd-icon-event-personal-travel',        description: 'Time away from work due to business travel' },


    typeList: {
        1: 'Project / Event',
        2: 'Project / Milestone',
        3: 'Project / Deadline',
        4: 'Project / Created',
        5: 'Project / Payment',

        10: 'Organization / Event',
        11: 'Organization / Holiday',

        20: 'Personal / Vacation', // Paid vacation
        21: 'Personal / Non paid vacation',
        22: 'Personal / Sick leave',
        24: 'Personal / Travel',
        23: 'Personal / Extra workday'
    },

    exportToOptions(arrEventTypes) {
        return arrEventTypes.map(function(eventType){
            return {
                value: eventType,
                label: gd.const.event.typeList[eventType]
            };
        });
    }


};