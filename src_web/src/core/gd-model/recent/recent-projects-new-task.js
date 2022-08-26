const AmpersandCollection = require('ampersand-collection');
const RecentProject = require('./recent-project');
const Moment = require('moment');
import localStorage from '../../../../src_web_changed/local-storage';

const RecentProjectsNewTask = AmpersandCollection.extend({

    model: RecentProject,

    comparator(m) {
        return -m.date.format("X");
    },

    initialize() {
        // we run init on collection creation !
        this.init();
    },

    init(models) {

      localStorage.getItem('recent.projectsNewTask')
        .then(lsProjects => {
          if (lsProjects !== null) {
            const arr = lsProjects.split(",");
            arr.map(value=>{
              const parts = value.split("-");

              this.add({
                projectId: parts[0],
                date: Moment.utc(parts[1],"X")
              },{silent: true});

            });

          }
        })

        /*const lsProjects = localStorage.getItem('recent.projectsNewTask');

        if (lsProjects !== null) {
            const arr = lsProjects.split(",");
            arr.map(value=>{
                const parts = value.split("-");

                this.add({
                    projectId: parts[0],
                    date: Moment.utc(parts[1],"X")
                },{silent: true});

            });

        }*//* else {
            if (!gd.session.me.id) return;

            const request = new ApiCall(this,'GET','recent/projectsNewTask');
            request.done(response=>{
                response.recentProjects.map(i=>{
                    this.add({
                        projectId: i.projectId,
                        date: Moment.utc(i.date)
                    },{
                        silent: true
                    });
                });
                this.save();

            });

            request.fail(error=>{
                console.log("error",error);
            });
        }*/
    },

    getSorted(){
        this.sort();
        return this;
    },

    projectView(projectId) {
        //find project if found - update it's time open to now ?
        const project = this.get(projectId);

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
    },

    save() {
        localStorage.saveItem('recent.projectsNewTask', this.toString());
    },

    toString() {
        return this.map(r=>r.localStorageFormat()).join(",");
    }
});

module.exports = RecentProjectsNewTask;