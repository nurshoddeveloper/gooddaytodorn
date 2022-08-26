var AmpersandCollection = require('ampersand-collection');
var RecentProject = require('./recent-project');
var Moment = require('moment');
var ApiCall = require('../../../../src_web_changed/core/gd/data/api-call');
import localStorage from '../../../../src_web_changed/local-storage';

var debug = false;

module.exports = AmpersandCollection.extend({
    model: RecentProject,

    comparator: function(m) {
        return -m.date.format("X");
    },

    init: function (models) {

        if (debug) console.log("RECENT PROJECTS] init");

        localStorage.getItem('recent.projects').then(lsProjects => {
            if (lsProjects !== null) {
                var arr = lsProjects.split(",");
                arr.map(function(value){

                    var parts = value.split("-");

                    this.add({
                        projectId: parts[0],
                        date: Moment.utc(parts[1],"X")
                    },{
                        silent: true
                    });

                }.bind(this));

                if (debug) {
                    console.log("[RECENT PROJECTS] (initFrom:LocalStorage)");
                    this.debug();
                }

            } else {

                if (!gd.session.me.id) return;

                //if (debug) console.log("[RECENT] project not found - need to init from DB");

                var request = new ApiCall(this,'GET','recent/projects');
                request.done(function(response) {
                    response.recentProjects.map(function(i){
                        this.add({
                            projectId: i.projectId,
                            date: Moment.utc(i.date)
                        },{
                            silent: true
                        });
                    }.bind(this));

                    if (debug) {
                        console.log("[RECENT PROJECTS] (init from db)");
                        this.debug();
                    }
                    this.save();

                });

                request.fail(function(error){
                    console.log("error",error);
                });
            }

        });
    },

    toString: function() {
        var projects = this.map(function(r){
            return r.localStorageFormat();
        });
        projects = projects.join(",");

        if (debug) console.log("[RECENT PROJECTS] (toString)",projects);
        return projects;
    },

    save: function() {
        localStorage.setItem('recent.projects', this.toString());
    },

    projectView: function(projectId) {
        if (debug) console.log("[RECENT PROJECTS] (projectView)",projectId);

        //find project if found - update it's time open to now ?
        var project = this.get(projectId);

        if (project) {
            project.date = Moment.utc(); //if found update date
        } else {
            this.add({
                projectId: projectId,
                date: Moment.utc()
            });
        }

        this.sort();
        this.save();

        if (debug) {
            console.log("[RECENT PROJECTS] (projectView) DONE");
            this.debug();
        }
    },

    getSorted(){
        this.sort();
        return this;
    },

    debug: function() {
        this.map(function(m){
            //var projectName = (gd)?gd.session.projects.get(m.projectId).name:"";
            var projectName = "";
            console.log(m.projectId,projectName ,m.date.format("MMM-DD H:mm:ss"),m.date);
        });
    }


});