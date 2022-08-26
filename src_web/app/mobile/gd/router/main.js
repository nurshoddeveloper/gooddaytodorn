const gd = require('ampersand-app');
const Router = require('ampersand-router');
// const LocalSettings = require('gd-local-settings');

module.exports = Router.extend({

    routes: {

        '': 'welcome',

        'my-work(/:folder)': 'myWork',

        't/:taskId': 'taskView',

        'setup': 'setup',

        'login': 'login',
        'logout': 'logout',

        '(*path)': 'catchAll'
    },

    // startPageLocalSetting: new LocalSettings("startpage",{
    //     project: 'overview',
    //     user: 'dashboard',
    //     organization: 'dashboard'
    // }),

    catchAll(path) {
        gd.launchApp(require('../../app/error-page/error-page'));
    },

    welcome: function() {
        gd.launchApp(require('../../app/welcome/app'),{});
    },

    setup: function() {
        gd.launchApp(require('../../app/setup/app'),{});
    },

    myWork: function(folder='') {

        let appParams = {
            folder: folder
        };
        gd.launchApp(require('../../app/my-work/app'),appParams);
    },

    taskView: function(taskId) {

        // let appParams = {
        //     taskId: taskId
        // };

        // gd.launchTaskApp(require('../../app/task/app'),appParams);
        gd.launchTaskApp(taskId);
    },


    login: function() {
        gd.launchApp(require('../../app/auth/login/login'),{});
    },

    logout: function() {
        gd.launchApp(require('../../app/auth/logout/logout'),{isBackground:true});
    }

});