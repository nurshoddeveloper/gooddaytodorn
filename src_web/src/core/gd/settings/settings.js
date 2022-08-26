const LocalSettings = require('./local-settings');



const defaults = {

    'global': {
        filterOrganization: 'all' //(!gd.isSingleOrganization())?'all':gd.session.companies[0].id
    },

    'mywork': {

        viewType: 'schedule',
        view: 'board',
        widget: 'note',

        showSomedayActionRequiredFromUser: '1',
        showSomedayActionRequiredProject: '1',
        showSomedayAssignedToMe: '1',
        showSomedayAllInvolved: '1',

        collapsedActionRequiredProject: '',
        collapsedAssignedToMe: '',
        collapsedAllInvolved: '',
        collapsedRecent: '',

        'last:AR.View': 'schedule',

        viewForUserId: ''
    },

    'events.calendar': {
        parent: '',
        user: '',
        typeFilter: '1,2,3',
        tasksFilter: 'deadline',
        scopeFilter: 'organization,project,personal',
        showCalendar: '1',
        weekView: "fullWeek",
        displayMode: 'month',
    },

    'startpage': {
        project: 'overview',
        user: 'dashboard',
        organization: 'dashboard',
        events: 'calendar',
        savePageSkipOnce: '0',
    },

    'project.events': {
        view: 'calendar',
        typeFilter: '1,2,3',
        tasksFilter: 'deadline',
        showCalendar: '1',
        weekView: "fullWeek",
        displayMode: 'month',
    },

    'new': {
        projectView: 'simple',
        showSharedTemplates: '0',
        openedSharedTemplates: ''
    },

    'new.task.inline' : {
        priority: '0',
        deadline: '0',
        estimate: '0',
    },

    'menu': {
        openItem: ''
    },

    'gd.project-tasks-table': {
        bulkEdit: '1',
        listSort: null,

        rightContainerColumnsCollapsed: 'main,users,time,dates,custom-fields'
    },

    'gd.project-tasks-list-new': {
        bulkEdit: '1',
        listSort: null,

        rightContainerColumnsCollapsed: 'main,users,time,dates,custom-fields'
    },

    'gd.view.proto.tasks-list': {
        bulkEdit: '1',
        listSort: null,

        rightContainerColumnsCollapsed: 'main,users,time,dates,custom-fields'
    },

    'gd.task-view': {
        viewLevel: '2',

        viewOpen: '0',
        usersOpen: '0',
        customFieldsOpen: '1',
        timeReportsOpen: '0',

        layout: 'modal',

        dependsOnOpen: '1',
        dependsOnHideCompleted: '0',

        dependentTasksOpen: '1',
        dependentTasksHideCompleted: '0',

        subtasksOpen: '1',
        subtasksHideCompleted: '0',

        todoOpen: '1',
        todoHideCompleted: '0'

        // completedOpen: '1'
    },

    'user.tasks': {
        viewBy: 'actionRequired',

        filters: '1',

        filterViewOpen: '1',
        filterParentOpen: '0',
        filterUserOpen: '0'
    },

    'gantt': {
        dependenciesUpdateType: 'no-intersections',
        durationIgnoreWeekends: '0'
    },

    'gd.project.tasks.view': {
        lastVisitedSection: null
    },
};

class Settings {

    constructor() {

        this.global = new LocalSettings("global",{
            filterOrganization: 'all'
        });

        this.initializedSettings = {};
    }

    get myWork() { return this.get('mywork'); }

    get menu() { return this.get('menu'); }

    get projectEvents() { return this.get('project.events'); }

    get eventsCalendar() { return this.get('events.calendar'); }

    get new() { return this.get('new'); }

    get newTaskInline() { return this.get('new.task.inline'); }

    get projectTasksTable() {return this.get('gd.project-tasks-table');}

    get projectTasksListNew() {return this.get('gd.project-tasks-list-new');}

    get taskView() { return this.get('gd.task-view'); }

    get userTasks() { return this.get('user.tasks'); }

    get gantt() { return this.get('gantt'); }

    get projectTaskView() { return this.get('gd.project.tasks.view'); }

    get(name) {

        if (this.initializedSettings[name]) return this.initializedSettings[name];

        if (!defaults[name]) {
            gd.growl.error('Unknown settings name');
            return false;
        }

        // initialize
        this.initializedSettings[name] = new LocalSettings(name,defaults[name]);
        return this.initializedSettings[name];
    }

    viewTasksListColumns(viewId) { return this.getWithProto('gd.view.proto.tasks-list', 'view.tasks-list.columns.' + viewId); }

    getWithProto(protoName, name) {
        if (this.initializedSettings[name]) return this.initializedSettings[name];

        if (!defaults[protoName]) {
            gd.growl.error('Unknown settings name');
            return false;
        }

        // initialize
        this.initializedSettings[name] = new LocalSettings(name, defaults[protoName]);
        return this.initializedSettings[name];
    }
}

module.exports = Settings;