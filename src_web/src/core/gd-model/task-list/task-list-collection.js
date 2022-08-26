const AmpersandCollection = require('ampersand-collection');
const TaskListModel = require('./task-list-model');
const _ = require('lodash');

const ListItemsCollection = AmpersandCollection.extend({
    model: TaskListModel,

    comparator(m1,m2) {
        let res = 0;

        if (m1.type !== m2.type)
            res = m1.type === 'project' ? -1 : 1;
        else if (m1.type === 'project') {
            const m1name = _.lowerCase(m1.item.name);
            const m2name = _.lowerCase(m2.item.name);
            if (m1name !== m2name) res = m1name < m2name ? -1 : 1;
        } else {
            if (m1.item.momentCreated && m2.item.momentCreated) {
                const m1moment = m1.item.momentCreated.format("X");
                const m2moment = m2.item.momentCreated.format("X");
                if (m1moment !== m2moment) res = m1moment < m2moment ? -1 : 1;
                else if (m1.item.sortPosition !== m2.item.sortPosition)
                    res = m1.item.sortPosition < m2.item.sortPosition ? -1 : 1;
            }
        }

        return res;
    },

    addTasksAndProjects(tasks,projects) {
        let models = [];

        if (tasks)  tasks = tasks.map(t=>({ type: 'task', item: t }));
        if (projects) projects  = projects.map(p=>({ type: 'project', item: p }));

        if (tasks && projects){
            models = _.concat(tasks, projects);
        } else {
            models = tasks ? tasks : projects ? projects : [];
        }

        this.add(models,{parse:true});
    },

    updateChildrenItems(skipId) {

        this.map(listItem=>{
            listItem.childrenItems = [];
        });

        this.map(listItem=>{
            const { id, parentId } = listItem;
            if (parentId && id !== skipId) {
                const parent = this.get(parentId);
                if (parent) parent.childrenItems.push(listItem.id);
                else console.warn("ListItemsCollection updateChildrenItems: no parent item found for parentId", listItem.parentId);
            }
        });

    },

    getItemsCount(selectorString){
        let res = 0;
        switch (selectorString){
            case "done":
                this.map(m=>{ if (m.type === "task" && m.item.systemStatus === gd.const.systemStatus.COMPLETED) res++; });
                break;

            case "planning":
                this.map(m=>{ if (m.type === "task" && gd.const.systemStatus.isOpen(m.item.systemStatus) && m.item.scheduleStatus === 1) res++; });
                break;

            case "someday":
                this.map(m=>{ if (m.type === "task" && gd.const.systemStatus.isOpen(m.item.systemStatus) && m.item.scheduleStatus === 2) res++; });
                break;

            case "open":
                this.map(m=>{ if (m.type === "task" && gd.const.systemStatus.isOpen(m.item.systemStatus)) res++; });
                break;

            case "closed":
                this.map(m=>{ if (m.type === "task" && gd.const.systemStatus.isClosed(m.item.systemStatus)) res++; });
                break;

            default:
                this.map(m=>{ if (m.type === "task") res++; });
                break;
        }

        return res;
    },

    getAllUsersIDs() {
        const usersIDs = {};
        this.map(m=>{
            const {users} = m.item;
            users && users.map(u => { usersIDs[u.userId] = true});
        });

        return _.keys(usersIDs);
    },

    getProject(id) {
        const itemId = "p-"+id;
        return this.get(itemId);
    },

    getProjectChildren(id) {
        const res = [];
        const projectItem = this.getProject(id);
        const recursiveCollectChildren = childrenItems => {
            childrenItems.map(cI => {
                const cItem = this.get(cI);
                if(cItem){
                    res.push(new TaskListModel(cItem.toJSON()));
                    recursiveCollectChildren(cItem.childrenItems);
                }
            })
        };

        if (projectItem) recursiveCollectChildren(projectItem.childrenItems);
        res.map(item => {if (item.parentId === projectItem.id) item.parentId = null});

        return new ListItemsCollection(res, {parse:true});
    },

    getProjectParents(id) {
        const res = new ListItemsCollection();
        const projectItem = this.getProject(id);

        const recursiveCollectParent = parentId => {
            const pItem = this.get(parentId);
            if(pItem){
                res.add(pItem);
                recursiveCollectParent(pItem.parentId);
            }
        };

        if (projectItem) recursiveCollectParent(projectItem.parentId);

        return res;
    },

    getProjects(openOnly) {
        return new ListItemsCollection(this.filter(m=>m.type==='project' && (!openOnly || gd.const.systemStatus.isOpen(m.item.systemStatus))));
    },

    getFiltered(filterFunction) {
        return new ListItemsCollection(this.filter(filterFunction), {parse:true});
    }

});

module.exports = ListItemsCollection;


















