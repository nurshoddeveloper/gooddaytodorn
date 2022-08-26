import _ from 'lodash';

class StructureControl {

    // Access control
    // Nesting control
    // Business logics control

    static canCreate(destination) {
        const { TAG } = gd.const.project.type;
        return gd.const.systemStatus.isOpen(destination.systemStatus) && destination.systemType !== TAG;
    }

    /******* TASK *********/

    static canMoveTask(task) {
        let result = false;
        const parentId = task.parentId;
        if (parentId) {
            const project = gd.session.projects.get(parentId);
            if (project) {
                const isCompanyManager = gd.ac.check.company.isManager(project.companyId);
                const isParentProjectManager = parentId ? gd.ac.check.project.standardAccess(parentId) : false;

                result = isCompanyManager || isParentProjectManager;
            }
        }

        return result;
    }

    static canMoveTaskIntoTask(task, hasChildren, destination, options = {
        allowMoveToTaskParent: false
    }) {
        const { allowMoveToTaskParent } = options;
        let result = false;

        const moveOpen = gd.const.systemStatus.isOpen(task.systemStatus);
        const targetClosed = gd.const.systemStatus.isClosed(destination.systemStatus);

        const parentId = destination.parentId;
        let hasAccess = true;
        if (parentId) {
            const project = gd.session.projects.get(parentId);
            hasAccess = project ? gd.ac.check.project.standardAccess(parentId) : false;
        }

        if (hasAccess &&
            task.id !== destination.id &&
            (allowMoveToTaskParent || task.parentTaskId !== destination.id) &&
            !(targetClosed && moveOpen)){
            result = destination.systemType !== gd.const.taskSystemType.SUBTASK
                    && !hasChildren;
        }

        return result;
    }

    static canMoveTaskIntoProject(task, destination) {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;
        let result = false;

        //check access
        const accessGranted = gd.ac.check.project.standardAccess(destination.id);

        //if assess is allowed then check further
        if (accessGranted) {
            const targetSType = destination.systemType;

            const moveOpen = gd.const.systemStatus.isOpen(task.systemStatus);
            const targetClosed = gd.const.systemStatus.isClosed(destination.systemStatus);

            //check if same item or move open item to closed
            if (!(targetClosed && moveOpen)) {
                switch (targetSType) {
                    case TAG:
                        result = false;
                        break;

                    case PROJECT:
                    case WORKFOLDER:
                    case BACKLOG:
                    case SPRINT:
                        result = true;
                        break;
                }
            }
        }

        return result;
    }

    /******* PROJECT *********/

    static canMoveProject(projectId, parentProject) {
        let result = false;
        if (projectId) {
            const project = gd.session.projects.get(projectId);
            if (project) result = gd.ac.check.project.fullAccess(project.id, project);
        }
        return result;
    }

    static canMoveProjectIntoProject(project, destination) {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;
        //const { MAX_NESTED_PROJECTS } = MoveManager;
        let result = false;

        const targetId = destination.id;
        const moveId = project.id;

        //check access
        const accessGranted = gd.ac.check.project.canCreateSubproject(targetId);

        //if assess is allowed then check further
        if (accessGranted){
            const targetSType = destination.systemType;
            const moveSType = project.systemType;

            const targetClosed = gd.const.systemStatus.isClosed(destination.systemStatus);
            const moveOpen = gd.const.systemStatus.isOpen(project.systemStatus);

            //check if same item or move open item to closed
            if (targetId !== moveId && !(targetClosed && moveOpen)) {
                const treeProjectParents = gd.tree.findProjectParents(gd.tree.getProject(targetId));

                let isChildrenOfDraggedItem = false;
                treeProjectParents.map(p=>{if(p.id === moveId) isChildrenOfDraggedItem = true;});

                //check moving to own child
                if (!isChildrenOfDraggedItem) {
                    switch(targetSType) {
                        case TAG:       result = false; break;

                        case PROJECT:   result = true; break;

                        case WORKFOLDER:
                            result = true;

                            //check if current item has any parent of BACKLOG or SPRINT type projects
                            let hasParentSprintBacklog = false;
                            treeProjectParents.map(p=>{if([SPRINT,BACKLOG].indexOf(p.systemType) !== -1) hasParentSprintBacklog = true});

                            if (hasParentSprintBacklog) {
                                //not allowed to drop PROJECT, BACKLOG or SPRINT into this item
                                if ([PROJECT,SPRINT,BACKLOG].indexOf(moveSType) !== -1) result = false;

                                //not allowed to drop here WORKFOLDER that contains any project except WORKFOLDERs
                                if ([WORKFOLDER].indexOf(moveSType) !== -1){
                                    const treeProjectChildren = gd.tree.findProjectChildren(moveId);
                                    treeProjectChildren.map(p=>{if(p.systemType !== WORKFOLDER) result = false});
                                }
                            }
                            break;

                        case BACKLOG:
                        case SPRINT:
                            result = project.systemType === WORKFOLDER;

                            //not allowed to drop here WORKFOLDER that contains any project except WORKFOLDERs
                            if (moveSType === WORKFOLDER){
                                const treeProjectChildren = gd.tree.findProjectChildren(moveId);
                                treeProjectChildren.map(p=>{if(p.systemType !== WORKFOLDER) result = false});
                            }
                            break;
                    }
                }

                /*if (res) {
                    const maxNested = MAX_NESTED_PROJECTS + 1;

                    if (draggedItem.type !== "project" || draggedItem.getProjectChildrenLevel() + treeProjectParents.length < maxNested) {
                        res = !draggedItem.isParent(dropItem.id)
                    }
                }*/
            }
        }

        return result;
    }

    /******* NEW OPTIONS *********/

    static newProjectOptions(destinationProjectId) {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;

        const parentProject = gd.tree.getProject(destinationProjectId);

        let allowedProjectTypes;
        if (parentProject) {
            switch (parentProject.systemType) {
                case PROJECT:
                case WORKFOLDER:
                    allowedProjectTypes = [PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG];
                    break;

                case BACKLOG:
                case SPRINT:
                    allowedProjectTypes = [WORKFOLDER];
                    break;

                case TAG:
                    allowedProjectTypes = [];
                    break;
            }

            const projectParents = gd.tree.findProjectParents(parentProject);
            projectParents.map(p=>{if([SPRINT,BACKLOG].indexOf(p.systemType) !== -1) allowedProjectTypes = [WORKFOLDER]});
        }

        return allowedProjectTypes;
    }

    static newParentOptions(section) {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;

        switch(section){
            case PROJECT:
            case BACKLOG:
            case SPRINT:
            case TAG: return [PROJECT,WORKFOLDER];

            case "event":
            case WORKFOLDER:
            case "task": return [PROJECT, WORKFOLDER, BACKLOG, SPRINT];

            case "report":
            case "user":
            case "tagFilter": return [PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG];
        }

        return [PROJECT, WORKFOLDER, BACKLOG, SPRINT];
    }

    /******* CONVERT OPTIONS *********/
    static convertOptions(project) {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;
        const { systemType } = project;
        let result = [];

        //should not contain any parent of BACKLOG or SPRINT type projects
        const hasParentSprintBacklog = (id)=>{
            let res = false;
            const treeProjectParents = gd.tree.findProjectParents(gd.tree.getProject(id));
            treeProjectParents.map(p=>{if([SPRINT,BACKLOG].includes(p.systemType)) res = true});
            return res;
        };

        //should not contain any project except WORKFOLDERs to convert into BACKLOG or SPRINT
        const hasChildrenNotWorkfolders = (id)=>{
            let res = false;
            const children = gd.tree.findProjectChildren(id);
            children.map(p=>{if(p.systemType !== WORKFOLDER) res = true});
            return res;
        };

        switch(systemType){
            case WORKFOLDER:
                if (hasParentSprintBacklog(project.id)) {
                    result = [];
                } else {
                    result = hasChildrenNotWorkfolders(project.id) ? [PROJECT] : [PROJECT, BACKLOG, SPRINT];
                }
                break;

            case PROJECT:
                result = hasChildrenNotWorkfolders(project.id) ? [WORKFOLDER] : [WORKFOLDER, PROJECT, BACKLOG, SPRINT];
                break;

            case BACKLOG: result = [PROJECT, WORKFOLDER, SPRINT]; break;
            case SPRINT: result = [PROJECT, WORKFOLDER, BACKLOG]; break;
        }

        return result;
    }

    /******* ALLOWED TASK TYPES *********/
    static getTaskTypes(projectId, options = {
        exportToOptions: false
    }) {
        const { exportToOptions } = options;
        let taskTypes = [];

        const projects = projectId ? gd.tree.findProjectParents(gd.tree.getProject(projectId)).map(p=>p.id).concat([projectId]) : [];

        projects.reverse().map(pId=>{
            if (taskTypes.length > 0) return;
            const project = gd.session.projects.get(pId);
            if (project) project.taskTypes.map(id=>{
                // vic fix.. hez why no lomaetsya pri udelennih
                if (gd.session.taskTypes.get(id)) {
                    const taskType = gd.session.taskTypes.get(id).clone();
                    if (!taskType.isDeleted) taskTypes.push(taskType)
                }
            });
        });

        if (taskTypes.length === 0) {
            const project = gd.session.projects.get(projectId);
            if (project) {
                taskTypes = gd.session.taskTypes.filterByCompany(project.companyId);
                if (_.find(taskTypes.models, tt=>tt.settings.isGeneric))
                    taskTypes = taskTypes.filter(tt=>tt.settings.isGeneric);
            }
        }

        return exportToOptions ? taskTypes.map(m=>({
            value: m.id,
            label: m.name,
            icon: m.icon
        })) : taskTypes.map(m=>m.id)
    }
}


module.exports = StructureControl;