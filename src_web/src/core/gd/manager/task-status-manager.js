import _ from 'lodash';

class TaskStatusManager {

    static isProjectStatusesOverridden(projectId ) {
        const project = gd.session.projects.get(projectId);

        if (!project) {
            gd.utils.captureErrorMessage('TaskStatusManager isProjectStatusesOverridden: no project found', {
                level: 'error', // one of 'info', 'warning', or 'error'
                extra: {
                    projectId: projectId,
                    project: project,
                    projects: gd.session.projects,
                    jsonProjects: JSON.stringify(gd.session.projects),
                }
            });
        }

        return project && project.taskStatusesOverride && project.taskStatusesOverride.length > 0;
    }

    static getDefaultTaskStatuses(projectId) {
        const project = gd.session.projects.get(projectId);
        const { statuses } = gd.session.taskTypes.filterByCompany(project.companyId).models[0];
        return project && project.taskStatusesOverride && project.taskStatusesOverride.length > 0 ?
            project.taskStatusesOverride : statuses.map(s=>s.status.id);
    }

    static getTaskStatuses({projectId,taskTypeId}, options = {
        idOnly: false,
        exportToOptions: false,
        orderBySystemStatus: false
    }) {
        const { idOnly, exportToOptions, orderBySystemStatus } = options;
        let res;
        const parentProjects = gd.tree.findProjectParents(gd.tree.getProject(projectId)).map(p=>p.id).concat([projectId]).reverse();
        parentProjects.map(pId=>{
            const { taskStatusesOverride } = gd.session.projects.get(pId);
            if (!res && taskStatusesOverride && taskStatusesOverride.length > 0) res = taskStatusesOverride;
        });

        if (!res) {
            const project = gd.session.projects.get(projectId);
            if (project) {
                const { localTemplateId, sharedTemplateId } = project;
                const templateId = localTemplateId ? localTemplateId : sharedTemplateId;

                if (templateId) {
                    const template = gd.session.projects.get(templateId);
                    res = template && template.taskStatusesOverride ? template.taskStatusesOverride : [];
                }
                else {
                    // this warning tormozil all statusss pochemu to
                    // console.warn("ProjectStatusManager getProjectStatuses:", project.name, "no localTemplateId or sharedTemplateId set");
                }
            }
        }

        if ((!res || res.length === 0) && taskTypeId) {
            res = gd.session.taskTypes.get(taskTypeId).statuses.models.map(s=>s.status.id);
        }

        if (!res) res = [];

        if (orderBySystemStatus) res = _.orderBy(res, id=>gd.session.statuses.get(id).systemStatus, 'asc');

        if (exportToOptions) {
            res = res.map(sId=>{
                const status = gd.session.statuses.get(sId);
                return {
                    value:          status.id,
                    systemStatus:   status.systemStatus,
                    label:          status.name,
                    color:          status.color
                }
            });
        } else if (!idOnly) {
            res = res.map(sId=>gd.session.statuses.get(sId));
        }

        return res;
    }
}

module.exports = TaskStatusManager;