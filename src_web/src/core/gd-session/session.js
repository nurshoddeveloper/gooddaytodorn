const _ = require('lodash');
const ApiCall = require('../../../src_web_changed/core/gd/data/api-call');

const MyCompaniesCollection = require('../gd-model/company/my-companies');
const UsersCollection = require('../gd-model/user/gd-users');
const CompanyUsersCollection = require('../gd-model/company-user/company-users');
const GDFavorites = require('../gd-model/favorite/favorites');
const GDTaskTypes = require('../gd-model/task-type/gd-task-types');
const GDCustomFields = require('../gd-model/custom-field/gd-custom-fields');
const GDMe = require('../gd-model/me/gd-me');
const GDAccountSettings = require('../gd-model/account-settings/gd-account-settings');
const GDDepartments = require('../gd-model/department/gd-departments');
const GDDepartment = require('../gd-model/department/gd-department');
const GDProjectGroups = require('../gd-model/project-group/gd-project-groups');
const UpdatesCollection = require('../gd-model/update/updates');
const GDPins = require('../gd-model/pin/pins');
const GDStarredItems = require('../gd-model/starred/starred-items');
const GDProjectUsers = require('../gd-model/project-user/project-users');
const GDInvitation = require('../gd-model/user-invitation/user-invitations');
const GDModules = require('../gd-model/modules/modules');
const GDWorkScheduleAccess = require('../gd-model/work-schedule-access/work-schedule-access-collection');
const MyWorkCollection = require('../gd-model/my-work/my-work-collection');
const DashboardTilesCollection = require('../gd-model/dashboard/tile-collection');
const DashboardRecentActivityCollection  = require('../gd-model/dashboard/recent-activity-collection');
const StatusesCollection = require('../gd-model/status/status-collection');
const ProjectTypeCollection = require('../gd-model/project-type/project-type-collection');
const GroupTypeCollection = require('../gd-model/group-type/group-type-collection');
const BoardCollection = require('../gd-model/board/board-collection');
const SessionCounters = require('./counters');

// Session collections
const ProjectCollectionSession = require('../gd-model/project/project-collection-session');

const RecentTasks = require('../gd-model/recent/recent-tasks');
const RecentProjects = require('../gd-model/recent/recent-projects');
const RecentProjectsNewTask = require('../gd-model/recent/recent-projects-new-task');
const RecentUsers = require('../gd-model/recent/recent-users');
const RecentOrganizations = require('../gd-model/recent/recent-organizations');

const SessionLoader = require('../../../src_web_changed/core/gd/data/session-loader');

const debug = {
    error: false,
    dev: false,
    monitor: false,
    missing: false
};

const GdSession = {

    me: new GDMe(),
    accountSettings: new GDAccountSettings(),

    statuses: new StatusesCollection(),

    dashboard: new DashboardTilesCollection(),
    dashboardActivity: new DashboardRecentActivityCollection(),

    users: new UsersCollection(),

    invitations: new GDInvitation(),

    companies: new MyCompaniesCollection(),
    companyUsers: new CompanyUsersCollection(),

    projects: new ProjectCollectionSession(),
    templatesList: new ProjectCollectionSession(),
    projectUsers: new GDProjectUsers(),
    projectGroups: new GDProjectGroups(),

    favorites: new GDFavorites(),
    pins: new GDPins(),

    departments: new GDDepartments(),
    department: new GDDepartment(),

    myWork: new MyWorkCollection(),
    updates: new UpdatesCollection(),
    counters:  new SessionCounters(),

    taskTypes: new GDTaskTypes(),
    projectTypes: new ProjectTypeCollection(),
    groupTypes: new GroupTypeCollection(),
    customFields: new GDCustomFields(),

    starredItems: new GDStarredItems(),

    boardsMenu: new BoardCollection(),
    boardsAll: null,

    modules: new GDModules(),
    workScheduleAccess: new GDWorkScheduleAccess(),

    recent: {
        tasks: new RecentTasks(),
        projects: new RecentProjects(),
        projectsNewTask: new RecentProjectsNewTask(),
        users: new RecentUsers(),
        organizations: new RecentOrganizations()
    },


    //session system
    historyMaxEvents: 200,
    historyEvents: {},

    init: function() {
        this.recent.tasks.init();
        this.recent.projects.init();
        //this.recent.projectsNewTask.init(); // NO NEED TO RUN IT AS IT is initialized on creation!
        this.recent.users.init();
        //this.recent.organizations.init(); // NO NEED TO RUN IT AS IT is initialized on creation!

    },

    findMissing(obj) {


        if (debug.missing) console.log("@Session find missing data");

        let result = {};

        _.forEach(obj,function(val,key){

            let missing = [];

            switch (key) {

                case 'users':
                    missing = val.filter(id=>{
                        if (!gd.session.users.get(id)) return id;
                    });
                    break;

                case 'taskTypes':
                    missing = val.filter(id=>{
                        if (!gd.session.taskTypes.get(id)) return id;
                    });
                    break;

                case 'customFields':
                    missing = val.filter(id=>{
                        if (!gd.session.customFields.get(id)) return id;
                    });
                    break;

                case 'statuses':
                    missing = val.filter(id=>{
                        if (!gd.session.statuses.get(id)) return id;
                    });
                    break;

                case 'projects':
                    missing = val.filter(id=>{
                        if (!gd.session.projects.get(id)) return id;
                    });
                    break;

                case 'projectsWithParents':
                    missing = val;
                    break;

                case 'projectTypes':
                    missing = val.filter(id=>{
                        if (!gd.session.projectTypes.get(id)) return id;
                    });
                    break;

                case 'projectsSettings':
                    missing = val.filter(id=>{
                        const project = gd.session.projects.get(id);
                        if (project && !project.settings) return id;
                    });
                    break;

                default:
                    console.error("Session: findMissing unknown key", key);
            }

            if (debug.missing) console.log('missing ',key,'=',missing);

            if (missing.length>0) result[key] = missing;

        });

        //if (debug.missing) console.groupEnd();

        if (_.size(result)>0) return result;
        else return false;

    },

    resetAll() {

        if (debug.monitor) console.log("session reset all");

        const res = new ApiCall(this,'get','session');

        res.done(function(data){
            if (debug.monitor) console.log("RESET DONE");
        });

        res.fail(function(error){
            if (debug.error) console.error("Session reset error");
        });
    },

    historyAdd(event){
        this.historyEvents[event.uid] = event;
    },

    // This is general events processor we receive from Ajax Request or Presence
    processEvents(events){
        let processSessionEventDone = true;

        /*//check if you need load more data before process events
        events.map(rawEvent=>{
            if(rawEvent.object === "project" && rawEvent.method === "reset") {
                console.log("Session processEvents", rawEvent.data);
            }
        });*/


        if (debug.monitor) {
            console.log("@Session new events",events.length);
            _.forEach(events, function(rawEvent, key) {
                console.log(rawEvent);
            });
            //console.groupEnd();
        }

        _.forEach(events, rawEvent=>{
            //Check if we already parse this event
            if (this.historyEvents[rawEvent.uid]) {
                if (debug.monitor) console.warn("SKIP EVENT",rawEvent);
            } else {
                this.historyAdd(rawEvent);
                const event = this.eventFactory(rawEvent);

                if (event && event.validate()) {
                    event.process();
                    //ToDo: add history of events by uid so we dont' run same event twice (!)
                } else {
                    if (debug.error) console.error("session event not valid",event.uid);
                }
            }
        });




        // POST PROCESS
        //check if you need load more data before process events

        let postEventProcessMissingData = {};

        events.map(rawEvent=>{


            if (rawEvent.object === "project" && rawEvent.method === "reset") {
                // console.log("Session processEvents", rawEvent.data);
                const allTemplateIds = [];

                if (rawEvent.data) {
                    rawEvent.data.map(project=>{
                        if (project.isTemplate) return;
                        if (project.localTemplateId) allTemplateIds.push(project.localTemplateId);
                    });
                }

                if (allTemplateIds.length > 0) {
                    if (!postEventProcessMissingData.projects) postEventProcessMissingData.projects = [];
                    postEventProcessMissingData.projects = postEventProcessMissingData.projects.concat(_.uniq(allTemplateIds));
                }
            }

            if (rawEvent.object === "project" && rawEvent.method === "new") {
                if (rawEvent.data && rawEvent.data.localTemplateId) {
                    if (!postEventProcessMissingData.projects) postEventProcessMissingData.projects = [];
                    postEventProcessMissingData.projects.push(rawEvent.data.localTemplateId);
                }
            }

        });

        const keys = _.keys(postEventProcessMissingData);
        if (keys.length > 0) {
            processSessionEventDone = new SessionLoader();
            processSessionEventDone.process(this.findMissing(postEventProcessMissingData));

            /*processSessionEventDone.done(()=>{
                console.log("Session processEvents processSessionEventDone");
            })*/
        }

        return processSessionEventDone;
    },

    eventFindMissing(rawEvent) {
        switch(rawEvent.object) {
            case "project": break;
        }
    },

    eventFactory: function(rawEvent) {
        const event = null;
        let Event;

        //if (gdConfig.nativeApp) console.log('eventFactory', rawEvent.object, rawEvent.method);

        switch (rawEvent.object) {
            case 'me':
                switch (rawEvent.method) {

                    case 'change':
                        Event = require('./me/me-change');
                        // return new Event(rawEvent.uid,rawEvent.data);
                        break;
                    default:
                        console.error("Error in event parsing A0394");
                        break;

                }
                break;
            case 'account-settings':
                switch (rawEvent.method) {
                    case 'change': Event = require('./account-settings/reset'); break;
                }
                break;
            case 'dashboard':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./dashboard/reset'); break;
                }
                break;
            case 'company':
                switch (rawEvent.method) {

                    case 'reset': Event = require('./company/reset'); return new Event(rawEvent.uid,rawEvent.data); break;

                    case 'new':
                        const EventCompanyNew = require('./company/company-new');
                        return new EventCompanyNew(rawEvent.uid,rawEvent.data);
                        break;

                    case 'change':
                        const EventCompanyChange = require('./company/company-change');
                        return new EventCompanyChange(rawEvent.uid,rawEvent.data);
                        break;

                    default: console.log("Error in event parsing A0394"); break;

                }
                break;
            case 'user':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./user/reset'); break;
                    case 'reset-by-company': Event = require('./user/reset'); break;
                    case 'change': Event = require('./user/change'); break;
                    //case 'change-personal': Event = require('./user/change-personal'); break;
                    default: console.error("Error in event parsing A0394"); break;
                }
                break;
            case 'company-user':
                switch (rawEvent.method) {
                    case 'change': Event = require('./company-user/change'); break;
                    case 'reset': Event = require('./company-user/reset'); break;
                    case 'delete': Event = require('./company-user/delete'); break;
                    case 'new': Event = require('./company-user/new'); break;
                    default: console.error("Error in event parsing A0394"); break;
                }
                break;
            case 'company-priority':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./company-priority/reset'); break;
                    case 'reset-by-company': Event = require('./company-priority/reset-by-company'); break;
                }
                break;

            case 'company-settings':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./company/company-settings'); break;
                }
                break;

            case 'starred':
                switch (rawEvent.method) {
                    case 'reset':
                        const Event = require('./starred/reset');
                        return new Event(rawEvent.uid,rawEvent.data);
                        break;

                    default: console.log("Error in event parsing A0294"); break;

                }
                break;
            case 'pin':
                switch (rawEvent.method) {
                    case 'reset':
                        const EventPinsReset = require('./pin/pins-reset');
                        return new EventPinsReset(rawEvent.uid,rawEvent.data);
                        break;

                    default:
                        console.log("Error in event parsing A0294");
                        break;

                }
                break;

            case 'project':
                switch (rawEvent.method) {

                    case 'delete': Event = require('./project/project-delete'); break;

                    case 'change':
                        const EventProjectChange = require('./project/project-change');
                        return new EventProjectChange(rawEvent.uid,rawEvent.data);

                    case 'new':
                        const EventProjectNew = require('./project/project-new');
                        return new EventProjectNew(rawEvent.uid,rawEvent.data);

                    case 'reset':
                        const EventProjectsReset = require('./project/projects-reset');
                        return new EventProjectsReset(rawEvent.uid,rawEvent.data);

                    default:
                        console.log("Error in event parsing A0294");
                        break;

                }
                break;

            case 'project-settings':
                switch (rawEvent.method) {

                    case 'reset':
                        const EventProjectsSettings = require('./project/projects-settings');
                        return new EventProjectsSettings(rawEvent.uid,rawEvent.data);

                    default:
                        console.log("Error in event parsing project-settings", rawEvent);
                        break;
                }
                break;

            case 'project-user':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./project-user/reset'); break;
                    case 'reset-by-company': Event = require('./project-user/reset-by-company'); break;
                    case 'reset-by-project': Event = require('./project-user/reset-by-project'); break;
                    // default: console.log("Error in event parsing A0294"); break;
                }
                break;
            //case 'project-group':
            //    switch (rawEvent.method) {
            //
            //        case 'reset':
            //            const EventProjectGroupsReset = require('./project-groups/project-groups-reset');
            //            return new EventProjectGroupsReset(rawEvent.uid,rawEvent.data);
            //            break;
            //
            //        case 'reset-by-company':
            //            const EventProjectGroupsResetByCompany = require('./project-groups/project-groups-reset-by-company');
            //            return new EventProjectGroupsResetByCompany(rawEvent.uid,rawEvent.data);
            //            break;
            //
            //        default: console.log("Error in event parsing A0294"); break;
            //    }
            //    break;
            case 'department':
                switch (rawEvent.method) {

                    case 'reset':
                        const EventDepartmentsReset = require('./department/department-reset');
                        return new EventDepartmentsReset(rawEvent.uid,rawEvent.data);
                        break;

                    case 'reset-by-company':
                        const EventDepartmentsResetByCompany = require('./department/department-reset-by-company');
                        return new EventDepartmentsResetByCompany(rawEvent.uid,rawEvent.data);
                        break;

                    default: console.log("Error in event parsing A0294"); break;
                }
                break;
            case 'task':
                switch (rawEvent.method) {

                    case 'reset':
                        const EventTaskReset = require('./task/task-reset');
                        return new EventTaskReset(rawEvent.uid,rawEvent.data);
                        break;

                    default: console.log("Error in event parsing A0294"); break;
                }
                break;
            case 'my-work':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./my-work/reset'); break;
                    case 'new': Event = require('./my-work/new'); break;
                    case 'delete': Event = require('./my-work/delete'); break;
                    case 'change-positions': Event = require('./my-work/change-positions'); break;
                    case 'change': Event = require('./my-work/change'); break;
                }
                break;
            case 'update':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./update/reset'); break;
                    case 'new': Event = require('./update/new'); break;
                }
                break;
            case 'counter':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./update/counter'); break;
                }
                break;
            case 'project-type':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./project-type/reset'); break;
                    case 'reset-by-company': Event = require('./project-type/reset-by-company'); break;
                    case 'new': Event = require('./project-type/new'); break;
                }
                break;
            case 'group-type':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./group-type/reset'); break;
                    //case 'reset-by-company': Event = require('./project-type/reset-by-company'); break;
                }
                break;
            case 'boards':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./board/reset'); break;
                }
                break;
            case 'boards-menu':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./board/menu-reset'); break;
                }
                break;
            case 'task-type':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./task-type/reset'); break;
                    case 'reset-by-company': Event = require('./task-type/reset-by-company'); break;
                    case 'new': Event = require('./task-type/new'); break;
                }
                break;
            case 'custom-field':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./custom-field/reset'); break;
                    case 'reset-by-company': Event = require('./custom-field/reset-by-company'); break;
                    case 'new': Event = require('./custom-field/new'); break;
                }
                break;
            case 'status':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./status/reset'); break;
                    case 'reset-by-company': Event = require('./status/reset-by-company'); break;
                    case 'new': Event = require('./status/new'); break;
                }
                break;
            case 'favorite':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./favorite/reset'); break;
                    default: console.log("Error in event parsing A0394"); break;
                }
                break;
            case 'user-invitation':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./user-invitation/reset'); break;
                    default: console.log("Error in event parsing A0394"); break;
                }
                break;

            case 'modules':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./modules/reset'); break;
                }
                break;

            case 'work-schedule-access':
                switch (rawEvent.method) {
                    case 'reset': Event = require('./work-schedule-access/reset'); break;
                }
                break;
            default:
                if (debug.error) console.error("Unknow Event $324fdsf9");
                break;
        }

        if (!Event) {
            if (debug.error) console.error("Unknown session Event",rawEvent);
            return false;
        }

        return new Event(rawEvent.uid,rawEvent.data);
    }

};

module.exports = GdSession;