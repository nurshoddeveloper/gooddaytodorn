module.exports = {


// gd.const.board.type -> use gd.const.views.TASK_LIST   (Yura)
// gd.const.board.url -> use gd.const.views[TYPE_INT].url
//
// po analogii delaem name i icon i.e.
//
// use gd.const.views[TYPE_INT].icon
// use gd.const.views[TYPE_INT].name
//
// url ....
// goodday.work/v/CALENDAR/12345    - custom view
// goodday.work/p/12345/CALENDAR    - project view
//
// PO IDEE GD.CONST.BOARD.* - voobche uidet i mozno zakomentit' budet !!!

    // TEAMBOARD: 1, - takogo netu
    ACTION_REQUIRED: 2, //old name TASKS_PLANNING
    PRIORITIES: 3,
    ACTIVE_PROJECTS: 4,
    TASKS_BY_USER: 5,
    ALL_TASKS_BOARD: 6,  // - remove and use gd.const.views.BOARD

    EVENTS_SUMMARY: 7,
    WHATS_DONE: 8,
    WORKLOAD: 9,
    PASTDUE: 10,

    EVENTS: 11, // same as calendar should us calendar in the future

    TASK_LIST: 12,
    TASK_TABLE: 13,
    BOARD: 14,
    TIMELINE: 15, // Gantt (!)
    SUMMARY: 16,
    CALENDAR: 17,
    FILES: 18,

    ACTIVITY: 19,
    RECENT: 20,

    // 1:  { name: 'Teamboard',         icon: '',                     url:  'team' },
    2:  { name: 'Action required',   icon: 'gd-icon-ar',           url:  'action-required' },
    3:  { name: 'Priorities',        icon: 'gd-icon-big-priority', url:  'priorities' },
    4:  { name: 'Active projects',   icon: 'gd-icon-portfolio',    url:  'active-projects'  },
    5:  { name: 'Tasks by user',     icon: 'gd-icon-task-by-user', url:  'tasks-by-user' },
    6:  { name: 'All tasks / board', icon: 'gdt-kanban',           url:  'task-board' },
    7:  { name: 'Events summary',    icon: 'gd-icon-event-project-event', url:  'events-summary' },
    8:  { name: 'What\'s done',      icon: 'gd-icon-ok',           url:  'what-is-done' },
    9:  { name: 'Resource planning', icon: 'gd-icon-resource-planning',   url:  'resource-planning' },
    10: { name: 'Past due',          icon: 'gd-icon-pastdue2',     url:  'pastdue' },
    11: { name: 'Calendar',          icon: 'gd-icon-calendar',     url:  'calendar' },

    12: { name: 'Task list',        icon: 'gdt-task-list',      url: 'tasks/list',  stringId: 'tasks_list',     appName: 'tasks', path: 'list' },
    13: { name: 'Task table',       icon: 'gd-icon-table-2',    url: 'tasks/table', stringId: 'tasks_table',    appName: 'tasks', path: 'table' },
    14: { name: 'Board',            icon: 'gd-icon-board-view', url: 'board',       stringId: 'board',          appName: 'board' },
    15: { name: 'Timeline',         icon: 'gd-icon-gantt',      url: 'gantt',       stringId: 'timeline',       appName: 'gantt' },
    16: { name: 'Summary',          icon: 'gd-icon-view-tiles', url: 'summary',     stringId: 'summary',        appName: 'dashboard' },
    17: { name: 'Calendar',         icon: 'gd-icon-calendar',   url: 'calendar',    stringId: 'calendar',       appName: 'events' },
    18: { name: 'Files',            icon: 'gd-icon-file',       url: 'files',       stringId: 'files',          appName: 'files' },
    19: { name: 'Activity stream',  icon: 'gd-icon-pulse',      url: 'activity',    stringId: 'activity',       appName: 'activity' },

    20: { name: 'Recent',            icon: 'gd-icon-recent',       url: 'recent' },
    /*exportToOptions: (systemType)=>{
        let res = [];
        switch(systemType){
            case 1/!*PROJECT*!/:      res = [this.SUMMARY, this.TASK_LIST, this.TASK_TABLE, this.BOARD, this.TIMELINE, this.CALENDAR, this.FILES]; break;
            case 2/!*WORKFOLDER*!/:   res = [this.SUMMARY, this.TASK_LIST, this.TASK_TABLE, this.BOARD, this.TIMELINE, this.CALENDAR, this.FILES]; break;
            case 3/!*BACKLOG*!/:      res = [this.SUMMARY, this.TASK_LIST, this.TASK_TABLE, this.BOARD,                               this.FILES]; break;
            case 4/!*SPRINT*!/:       res = [this.SUMMARY, this.TASK_LIST, this.TASK_TABLE, this.BOARD, this.TIMELINE,                this.FILES]; break;
            case 5/!*TAG*!/:          res = [this.SUMMARY, this.TASK_LIST, this.TASK_TABLE, this.BOARD,                               this.FILES]; break;
        }
        return res.map(id=>({
            value:  this[id].stringId,
            label:  this[id].name,
            icon:   this[id].icon
        }))
    }*/
};