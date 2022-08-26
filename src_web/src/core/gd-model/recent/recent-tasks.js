const AmpersandCollection = require('ampersand-collection');
const RecentTask = require('./recent-task');
const Moment = require('moment');
const ApiCall = require('../../../../src_web_changed/core/gd/data/api-call');
import localStorage from '../../../../src_web_changed/local-storage';

const debug = false;

const RecentTasks = AmpersandCollection.extend({
    model: RecentTask,

    maxTasks: 100,

    comparator(m) {
        return -m.date.format("X");
    },

    init(models) {


        // init tasks from DB if not localstorage found
        localStorage.getItem('recent.tasks').then(lsTasks => {

            if (debug) console.log("Recent tasks initialize");

            if (lsTasks !== null) {
                if (debug) console.log("Local storage found. Process...");
                const arr = lsTasks.split(",");
                arr.map((value)=>{

                    const parts = value.split("-");

                    this.add({
                        taskId: parts[0],
                        date: Moment(parts[1],"X")
                    },{silent: true});

                    //Todo - there is isiue with time zoens here.....
                });

                if (debug) {
                    console.log("Init from Local Storage Done");
                    this.debug();
                }
            } else {

                if (!gd.session.me.id) return;

                if (debug) console.log("[RECENT] tasks not found - need to init from DB");

                const request = new ApiCall(this,'GET','recent/tasks');

                request.done((response)=>{
                    response.recentTasks.map((i)=>{
                        this.add({
                            taskId: i.taskId,
                            date: Moment.utc(i.date).local()
                        });
                    });

                    if (debug) {
                        console.log("[RECENT TASKS] Init tasks from db done: ");
                        this.debug();
                    }

                    this.save();
                });

                request.fail((error)=>{ console.log("error",error); });
            }

            //if (debug) console.groupEnd();

        });


    },

    isTaskOpenedToday(taskId) {
        const tasks = this.filter((r) => r.taskId === taskId && r.date.isSame(Moment(),'day'));

        const isOpen = (tasks.length > 0);

        if (debug) console.log("[RECENT TASKS].isTaskOpenToday",taskId,"isOpen=",isOpen);

        return isOpen;
    },

    toString() {
        return this.map((r) => r.localStorageFormat()).join(",");
    },

    save() {
        if (debug) console.log("[Recent Tasks].save()",this.toString());
        localStorage.setItem('recent.tasks', this.toString());
    },

    getSorted() {
        this.sort();
        return this;
    },

    exportTasks() {
        return this.map(r=>r.getTask());
    },

    taskView(task) {
        const recentTask = this.get(task.id);
        const now = Moment();

        if (recentTask) {
            recentTask.date = now;
        } else {
            this.add({
                taskId: task.id,
                date: now,
                title: task.title,
                taskTypeId: task.taskTypeId ? task.taskTypeId : task.type,
                projectId: task.projectId,
                actionRequiredUserId: task.arUserId ? task.arUserId : task.actionRequiredUserId
            });
        }

        if (this.length > this.maxTasks) {
            this.models = this.models.slice(0,this.maxTasks);
        }

        this.save();
    },

    tasksRemove(removedTasksIds) {
        removedTasksIds.map(tid=>{this.remove(tid)});
        this.save();
    },

    debug() {
        this.map((m)=>{ console.log(m.taskId,m.date.format("MMM-DD H:mm:ss"),m.date); });
    }
});

module.exports = RecentTasks;