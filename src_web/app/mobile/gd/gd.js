const gdm = require('ampersand-app');

const Presence = require('../../../src/core/gd-presence/presence');




const EventsBus = require('../../../src/core/gd/events-bus');
const CompaniesCollection = require('../../../src/core/gd-model/tree/companies-collection');

const Settings = require('../../../src/core/gd/settings/settings');


const AccessControl = require('../../../src/core/gd/access-control/access-control');

//const Modal = require('../ui/modal/modal');
const Modal = {};
const { when } = require('simply-deferred');

//const TaskApp = require('../app/task/app');
const TaskApp = {};

require('../../../src/core/gd/polyfill/all');

const debug = {
    dev: true,
    head: "{GD-Mobile}"
};

gdm.extend({

    const: require('../../../src/core/gd/const'),
    skin: { init(){}},//require('../../../src/core/gd/skin'),
    loader: {}, //require('../../../src/core/gd/loader'),
    utils: require('../../../src/core/gd/utils/utils'),

    router: null,

    // Apps
    app: null,
    appTask: null,


    // Layout
    layout: null, // link to ui-layout app
    menu: null, // link to ui-menu app
    topPanel: null, //link to top panel
    new: null, // link to new task

    modal: null, // link to ui-modal
    growl: null, //link to global-notifications






    settings: null, //settings

    session: require('../../../src/core/gd-session/session'),
    presence: null,

    bus: new EventsBus(),
    tree: new CompaniesCollection(),

    // core local settings handler...
    coreLocalSettings: null,

    init: function() {

        // this.initCurOrganizationId();

        this.ac = new AccessControl();
        this.settings = new Settings();

        this.skin.init();
        this.session.init(); // we dont' really need it anymore

        this.presence = new Presence();
        //this.presence.init(); //andrew

        // this.taskView.init();

        const MainRouter = gdConfig.routing;
        this.router = new MainRouter();

        this.modal = Modal;
    },

    start: function() {
        if (debug.dev) console.log(debug.head,".start",this.router);
        this.router.history.start({ pushState: true });
    },

    getMainApp: function(){
        return this.app;
    },

    getApp: function(){
        let out;

        if (this.appTask) out = this.appTask;
        else out = this.app;

        return out;
    },

    goTo: function(url, options) {
        if (debug.dev) console.log(debug.head,"goTo",url,options);

        // if (url == 'new-project') {
        //     gd.openNew('project');
        //     return;
        // }
        //
        // if (url == 'new-user') {
        //     gd.openNew('user');
        //     return;
        // }

        //make sure app container is open
        gd.layout.display('main');

        if (window.location.pathname == "/" + url ){
            if (debug.dev) console.log(debug.head," same URI - reStart APP",url);
            this.getApp().start();
        }

        if (!options) options = {};
        options.trigger = true;

        this.router.navigate("#" + url, options);
    },

    goToTask(taskId) {
        this.goTo('t/'+taskId);
    },

    // goToProject(projectId) {
    //     this.goTo('p/'+projectId);
    // },

    setUrl(url, replace = true) {
        this.router.navigate(url, {
            trigger: false,
            replace: replace
        });
    },

    _destroyModal: function(){
        if (this.modal) this.modal.hide();
    },

    _destroyApp() {
        if (debug.dev) { console.log(debug.head,"._destroyApp()",this.app); }
        if (this.app) this.app.__destroy();
        // this.growl.removeAllButSticky();
    },

    _destroyTaskApp() {
        if (this.appTask) {
            this.appTask.__destroy();
            this.appTask = null;
        }
    },

    _destroyAnalyticstApp() {
        if (this.appAnalytics) {
            this.appAnalytics.__destroy();
            this.appAnalytics = null;
            this.layout.analyticsClose();
        }
    },

    _destroyFullModalApp() {
        if (this.fullModalApp) {
            this.fullModalApp.__destroy();
            this.fullModalApp = null;
        }
        gd.layout.fullModal.destroy();
    },

    launchApp(AppClass,params={}) {
        // this._destroyModal();
        // this._destroyTaskApp();
        const appName = AppClass.prototype.name || null;
        if (debug.dev) console.log(debug.head,".lauchApp", appName, params);

        gd.layout.display('main');

        params.initDone = true;

        if (this.app && this.app.routerPath === gd.router.history.getPath()) {
            if (debug.dev) console.log(debug.head," Same App - no Init", appName, params);
            //this.app.init(params);
        } else {
            this._destroyApp();

            if (debug.dev) console.log(debug.head," new App - Init", appName, params);

            this.app = new AppClass();
            this.app.init(params);
            this.app.routerPath = gd.router.history.getPath();
        }

        when(params.initDone).done(()=>{
            if (debug.dev) console.log(debug.head," app.Start", appName, params);
            this.app.start();
        });
    },

    launchTaskApp(taskId) {
        // this._destroyModal();
        // this._destroyFullModalApp();



        if (debug.dev) console.log(debug.head,".lauchTaskApp",params);

        let params = {
            taskId: taskId,
            initDone: true
        };
        // params.initDone = true;


        gd.layout.display('task');

        let startTask = true;
        if (!this.appTask){
            this.appTask = new TaskApp();
            this.appTask.init(params);
            this.appTask.routerPath = gd.router.history.getPath();
        } else {
            //do not start appTask if taskId is same as before;
            startTask = this.appTask.updateTaskId(params);
        }



        startTask && when(params.initDone).done(function(){
            this.appTask.start();
        }.bind(this));
    },


    // This is a helper for navigating around the app.
    navigate: function(page) {
        var url = (page.charAt(0) === '/') ? page.slice(1) : page;
        this.router.history.navigate(url, {
            trigger: true
        });
    },


    initCurOrganizationId() {
        // need it to complain with gd web & sessions

        // this.coreLocalSettings = new LocalSettings("gd",{
        //     curOrganizationId: null
        // });
        //
        // this.curOrganizationId = this.coreLocalSettings.get('curOrganizationId');
        // if (!this.curOrganizationId && this.session.companies.length)
        //     this.curOrganizationId = this.getCurOrganizationId(true); // if no cur org in locStorage - use the very first one
        //
        // // if something is wrong (no logout, etc) reset to defualts !
        // if (!this.session.companies.get(this.curOrganizationId)) {
        //     this.coreLocalSettings.resetToDefault();
        //     this.curOrganizationId = this.coreLocalSettings.get('curOrganizationId');
        // }

    },


    getCurOrganizationId(forced=false) {

        if (this.session.companies.length<1) return null;

        // this is for future ???
        if (this.organizationLock) {
            if (!this.curOrganizationId) {
                console.error("error company lock but no company");
                this.setCurOrganizationId(this.session.companies.models[0].id);
            }
        }

        if (forced && !this.curOrganizationId) {
            // if (g)
            this.setCurOrganizationId(this.session.companies.models[0].id);
        }

        return this.curOrganizationId;
    },

    setCurOrganizationId: function(organizationId) {

        if (organizationId=='all') organizationId='';

        // recent organizations
        if (this.curOrganizationId!=organizationId) {
            gd.session.recent.organizations.increaseCounter(organizationId);
        }

        this.curOrganizationId = organizationId;
        //this.coreLocalSettings.set('curOrganizationId',this.curOrganizationId);

        this.trigger('curOrganizationChanged');
    },

    apiError(error) {
        this.growl.error('Opps, something went wrong. Refresh the page and try again');
    },

    isSingleOrganization() {
        return (!(gd.session.companies.length>1));
    }


});

module.exports = gdm;
