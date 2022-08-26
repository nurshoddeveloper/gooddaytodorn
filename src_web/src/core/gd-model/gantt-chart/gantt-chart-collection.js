const AmpersandCollection = require('ampersand-collection');
const GanttChartItemModel = require('./gantt-chart-item-model');

const Moment = require('moment');
const _ = require('lodash');

const GanttChartCollection = AmpersandCollection.extend({
    model: GanttChartItemModel,

    comparator: "sortPosition",

    //sorted outside in order not to have any resort on collection manipulations
    /*comparator(m1,m2) {
        // results for m1
        // -1 - higher
        // 0 - same level
        // 1 - lower
        let res = 0;

        const compareStartDate = (m1,m2)=>{
            let res = 0;
            const m1moment = m1.item.startDate ? Moment(m1.item.startDate).format("X") : m1.getEarliestStartMoment().format("X");
            const m2moment = m2.item.startDate ? Moment(m2.item.startDate).format("X") : m2.getEarliestStartMoment().format("X");
            if (m1moment !== m2moment) res = m1moment < m2moment ? -1 : 1;
            return res;
        };

        //project to task
        if (m1.type !== m2.type){                                                   res = m1.type === 'project' ? -1 : 1;
        //for projects compare start dates
        } else if (m1.type === 'project'){                                          res = compareStartDate(m1,m2);
        //if m2 is someday
        } else if (m1.item.scheduleStatus !== 2 && m2.item.scheduleStatus === 2){   res = -1
        //if m1 is someday
        } else if (m1.item.scheduleStatus === 2 && m2.item.scheduleStatus !== 2){   res = 1
        //compare tasks startDate
        } else {                                                                    res = compareStartDate(m1,m2);
            //if tasks are still equal compare momentCreated
            if (res === 0) res = m1.item.momentCreated.format("X") < m2.item.momentCreated.format("X") ? -1 : 1;
        }

        return res;
    },*/

    addTasksAndProjects(tasks,projects) {
        let models = [];

        if (tasks)      tasks       = tasks.map(t=>{ return { type: 'task', item: t }});
        if (projects)   projects    = projects.map(g=>{ return { type: 'project', item: g }});

        if (tasks && projects) models = _.concat(tasks, projects);
        else models = tasks ? tasks : projects ? projects : [];

        this.add(models,{parse:true});
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
                    res.push(new GanttChartItemModel(cItem.toJSON()));
                    recursiveCollectChildren(cItem.childrenItems);
                }
            })
        };

        if (projectItem) recursiveCollectChildren(projectItem.childrenItems);
        res.map(item => {if (item.parentId === projectItem.id) item.parentId = null});

        return new GanttChartCollection(res, {parse:true});
    },

    updateChildrenItems() {
        this.map(listItem=>{listItem.childrenItems = []});

        this.map(listItem=>{
            if (listItem.parentId) {
                const parent = this.get(listItem.parentId);
                if (parent) parent.childrenItems.push(listItem.id);
                else console.warn("GanttChartCollection updateChildrenItems: no parent item found for parentId", listItem.parentId);
            }
        });
    },

    updateDependantDateRanges() {
        const { SOMEDAY } = gd.const.task.scheduleStatus;
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG} = gd.const.project.type;

        const today = Moment(Moment().format('YYYY-MM-DD'));

        this.map(listItem => {
            if (listItem.display > 0) {
                const { startDate, endDate, scheduleDate, systemType } = listItem.item;
                const isDependantItem = listItem.systemType === 'project' && [WORKFOLDER,BACKLOG].includes(systemType);

                //make sure that date range of this project is not less than date ranges of it's children
                const children = listItem.getAllChildren();
                let newStartMoment = null;
                let newEndMoment = null;

                if (listItem.type === "task" || !isDependantItem) {
                    newStartMoment = startDate ? Moment(startDate.format('YYYY-MM-DD')) : scheduleDate ? Moment(scheduleDate.format('YYYY-MM-DD')) : null;
                    newEndMoment = endDate ? Moment(endDate.format('YYYY-MM-DD')) : null;
                }

                if (children.length === 0) {
                    if (isDependantItem) listItem.updateStartEndDates(null,null);
                } else {
                    children.map(i => {
                        const { displayStartDate, displayEndDate, scheduleDate, systemType } = i.item;

                        if (i.display > 0 && !(i.item.scheduleStatus === SOMEDAY && !displayStartDate)) {
                            if (listItem.type === "task" || ![WORKFOLDER,BACKLOG].includes(systemType)) {
                                const startMoment = displayStartDate ? Moment(displayStartDate.format('YYYY-MM-DD')) :
                                    scheduleDate ? Moment(scheduleDate.format('YYYY-MM-DD')) : Moment(today);

                                const endMoment = displayEndDate ? Moment(displayEndDate.format('YYYY-MM-DD')) :
                                    (Moment(startMoment).isBefore(today, 'day') ? Moment(today) : Moment(startMoment));

                                if (!newStartMoment || newStartMoment.isAfter(startMoment))     newStartMoment = startMoment;
                                if (!newEndMoment || newEndMoment.isBefore(endMoment))          newEndMoment = endMoment;
                            }
                        }
                    });
                }

                if (newStartMoment && newEndMoment) {
                    listItem.item.displayStartDate = newStartMoment.toDate();
                    listItem.item.displayEndDate = newEndMoment.toDate();

                    //make sure parents date range is not less than date range of this project
                    const parents = listItem.getAllParents();

                    parents.map(pI => {
                        const { displayStartDate, displayEndDate } = pI.item;
                        if (displayStartDate && displayStartDate > newStartMoment) pI.item.displayStartDate = newStartMoment.toDate();
                        if (displayEndDate && displayEndDate < newEndMoment) pI.item.displayEndDate = newEndMoment.toDate();
                    });
                }
            }
        });
    },

    getProjectParents(id) {
        const res = new GanttChartCollection();
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

});

module.exports = GanttChartCollection;


















