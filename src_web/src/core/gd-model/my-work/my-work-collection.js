const _ = require('lodash');
const AmpersandCollection = require('ampersand-collection');
const FilteredSubcollection = require('ampersand-filtered-subcollection');
const MyWorkModel = require('./my-work-model');

const MyWorks = AmpersandCollection.extend({
    model: MyWorkModel,

    comparator(m1,m2) {

        let res = 0;
        if (!m2) return 0;

        // const m1sd = m1.scheduleDate;
        // const m2sd = m2.scheduleDate;

        /*const m1pastdue = m1.pastdueDays();
        const m2pastdue = m2.pastdueDays();

        //pastdue to top
        if (m1pastdue && m2pastdue === 0)           res = -1;
        else if (m1pastdue === 0 && m2pastdue)      res =  1;
        else if (m1pastdue && m2pastdue) {
            if (m1pastdue > m2pastdue)              res = -1;
            else if (m1pastdue < m2pastdue)         res =  1;
        }

        if (res !== 0) return res;*/


        /*//notifications with schedule date to top
        if (m1sd && !m2sd)                      res = -1;
        else if (!m1sd && m2sd)                 res =  1;
        else if (m1sd && m2sd) {
            if (m1sd.isBefore(m2sd, 'day'))     res = -1;
            else if (m1sd.isAfter(m2sd, 'day')) res =  1;
        }

        if (res !== 0) return res;*/

        //notifications with lower position to top
        if(m1.position < m2.position)           res = -1;
        else if (m1.position > m2.position)     res =  1;

        if (res !== 0) return res;

        if (m1.dateCreated.isAfter(m2.dateCreated))         res = -1;
        else if (m1.dateCreated.isBefore(m2.dateCreated))   res =  1;

        return res;
    },

    setPastdueDragging(value) {
        this.isPastdueDragging = value;
        this.trigger('change:isPastdueDragging', value)
    },

    getPastdueDragging() {
        return !!this.isPastdueDragging;
    },

    filterTasksAndEvents() {
        return new MyWorks(this.filter(m=>m.type === 1 || m.type === 2))
    },

    filterReports() {
        return new MyWorks(this.filter(m=>m.type === 4))
    },

    filterByProject(id, options = {}) {
        return new MyWorks(this.filter(m=>{
            const { task, projectId, report } = m;

            let pId = projectId;
            if (!pId && task) pId = task.projectId;
            if (!pId && report) pId = report.reportProjectId;

            let projects = [pId];
            if (pId && options.withChildren)
                projects = projects.concat(gd.tree.findProjectParents(gd.tree.getProject(pId)).map(p=>p.id));

            return projects.includes(id);
        }))
    },

    filterByCompany(id) {
        return new MyWorks(this.filter(m=>{
            const { task, projectId, report } = m;

            let pId = projectId;
            if (!pId && task) pId = task.projectId;
            if (!pId && report) pId = report.reportProjectId;

            let cId;
            const project = gd.session.projects.get(pId);
            if (project) cId = project.companyId;

            return cId === id;
        }))
    },

    filterByFromUser(id) {
        return new MyWorks(this.filter(m=>m.fromUserId === id))
    },

    folder(folderName) {
        const prefix = "subcollection_";

        if (!this[prefix+folderName]){
            this[prefix+folderName] = new FilteredSubcollection(this, {
                where: {
                    folder: folderName
                },

                comparator: (m1,m2)=>this.comparator(m1,m2)
            });

            /*this[prefix+folderName].on('sort', function(){
                this[prefix+folderName].models.sort(this[prefix+folderName].comparator);
            }.bind(this));*/
        }

        return this[prefix+folderName];
    },

    moveItemToPosition(itemId, folderId, position) {
        const groupItems = this.folder(folderId);

        let index = 1;
        groupItems.models.map((item, key)=>{

            if (item.id === itemId){
                item.set({
                    position: position !== null ? position : groupItems.models.length
                }, {silent: true});
            } else {

                if (index === position) index++;

                item.set({
                    position: index
                }, {silent: true});

                index++;
            }
        });

        groupItems.swapFilters([], []);
    },

    exportTasks() {
        const allTasks = this.filter(notification=>notification.type === 1);
        return allTasks.map(notification=>notification.getTask());
    },

    filterByFolder(folder) {
        return new MyWorks(this.filter(m=>m.folder === folder));
    },

    filterByFolderAndTypeTask(folder) {
      return new MyWorks(this.filter(m => m.folder === folder && (m.type === gd.const.myWork.type.TASK || m.type === gd.const.myWork.type.EVENT)));
    },

    exportMobile() {
        const { INBOX, SOMEDAY, PASTDUE, TODAY, DAY } = gd.const.myWork.group;

        let allItems = this.filter(m => m.type === gd.const.myWork.type.TASK || m.type === gd.const.myWork.type.EVENT);

        // add extra data
        let allUsers = [];
        let allTaskTypes = [];
        let allProjects = [];
        let allStatuses = [];
        let allCustomFields = [];

        allItems.map(function(item) {
            const { fromUserId, task, projectId } = item;
            if (fromUserId) allUsers.push(fromUserId);
            if (task && task.taskTypeId) allTaskTypes.push(task.taskTypeId);
            if (projectId) allProjects.push(projectId);
            //allStatuses.push(item.taskStatusId);
        });

        gd.session.findMissing({
            users: _.uniq(allUsers),
            taskTypes: _.uniq(allTaskTypes),
            projects: _.uniq(allProjects),
            //customFields: _.uniq(allCustomFields),
            //statuses: _.uniq(allStatuses)
        });

        allItems.map(function(item){
            item.project = gd.session.projects.get(item.projectId, 'id');
            item.fromUser = gd.session.users.get(item.fromUserId, 'id');
            //item.task.taskType = gd.session.taskTypes.get(item.task.taskTypeId);
            if (item.task) {
                item.task.url = 't/' + item.task.id;
            }
        });
        // ./add extra data

        let scheduled = {};
        let other = {
            inbox: [],
            pastdue: [],
            today: [],
            someday: []
        };

        allItems.map(function(item){

            switch (item.folder) {
                case SOMEDAY: other.someday.push(item); break;
                case PASTDUE: other.pastdue.push(item); break;
                case INBOX: other.inbox.push(item); break;
                case TODAY: other.today.push(item); break;

                default:
                    if (item.folder.substring(0,4) === DAY) {
                        const date = item.folder.substring(4);
                        if (!scheduled[date]) scheduled[date] = [];
                        scheduled[date].push(item);
                    }
                    break;
            }
        });

        let arrScheduled = _.map(scheduled,(val,key)=>{
            return {
                'date': key,
                'items': val
            };
        });

        other.scheduled = _.sortBy(arrScheduled,rec=>rec.date);

        return other;
    },

    findTaskById(id) {
      let task = null;

      this.some(m => {
        if (m.type === gd.const.myWork.type.TASK) {
          const tm = m.get('task');
          if (tm && tm.id == id) {
            task = tm;
            return true;
          }
        }
      });

      return task;
    }
});

module.exports = MyWorks;