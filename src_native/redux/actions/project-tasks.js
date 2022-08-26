import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';
import SessionLoader from '../../../src_web/src_web_changed/core/gd/data/session-loader';
import StructureControl from '../../../src_web/src/core/gd/structure-control/structure-control';
import _ from 'lodash';
import {
  PROJECT_TASKS_LOAD,
  PROJECT_TASKS_APPEND_NEW
} from '../constants';


export function loadProjectTasks(projectId) {
  console.log('loadProjectTasks');
  return {
    type: PROJECT_TASKS_LOAD,
    payload: getProjectTasksDataFull(projectId)
  }
}

function getProjectTasksDataFull(projectId) {
  return new Promise((resolve, reject) => {
    getProjectToWorkWith(projectId)
      .then(() => {
        getProjectTasksData(projectId)
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  });
}


async function getProjectToWorkWith(projectId) {
  return new Promise((resolve, reject) => {
    const project = gd.session.projects.get(projectId);
    if (project) {
      resolve(project);
      return;
    }
    const archivedLoader = apiCall(this, 'get', 'project/' + projectId + '/load-archived');
    archivedLoader.done(() => {
      const project = gd.session.projects.get(projectId);
      resolve(project);
    });
    archivedLoader.fail(() => {
      const err = new Error('archived projectId ' + projectId + ' not found');
      err.code  = 'archived_project_id_not_found';
      reject(err)
    });

  });
}



function getProjectTasksData(projectId) {
  return new Promise((resolve, reject) => {

    const { TAG } = gd.const.project.type;
    const project = gd.session.projects.get(projectId);
    if (!project) {
      const err = new Error('projectId ' + projectId + ' not found');
      err.code  = 'project_id_not_found';
      reject(err);
      return;
    }

    const url = project.systemType === TAG
      ? 'tag/' + projectId + '/tasks-open'
      : 'project/' + projectId + '/tasks-open';


    const dataLoader = apiCall(this, 'get', url);
    const sessionLoader = new SessionLoader();
    let data = null;

    dataLoader.done(response => {
      //console.log('response', response);
      data = response;
      sessionLoader.process(findMissingData(project, response));
    });

    dataLoader.fail((error)=>{
      if (error.code == 403) {
        reject(error);
      } else {
        reject(error);
      }
    });

    sessionLoader
      .then(() => {

        data.subprojects && data.subprojects.map(sp=>{ sp.companyId = project.companyId; });
        data.tasks && data.tasks.map(t=>{t.companyId = project.companyId;});

        // remove closed tasks
        if (data.tasks) {
          data.tasks = data.tasks.filter(el => gd.const.systemStatus.isOpen(el.systemStatus))
        }

        const projectIsTag = project.systemType === gd.const.project.type.TAG;

        //prepare tag tasks
        if (projectIsTag) {
          data.tasks && data.tasks.map(t=>{
            t.projectId = null;
            if (t.parentTaskId && !_.find(data.tasks, m=>m.id === t.parentTaskId)) {
              t.systemType = gd.const.taskSystemType.TASK;
              t.parentTaskId = null;
            }
          });
        }

        resolve({project, subprojects: data.subprojects, tasks: data.tasks});

      })
      .catch(error => {
        console.log('getProjectTasksData sessionLoader reject', error);
        reject(error);
      });

  });
}

function findMissingData(project, response) {
  if (!response) return false;

  const tasks = response.tasks ? response.tasks : [];
  const subprojects = response.subprojects ? response.subprojects : [];

  let allUsers = [];
  let allCustomFields = [];
  const parentProjects = gd.tree.findProjectParents(gd.tree.getProject(project.id)).map(p=>p.id);

  parentProjects && parentProjects.map(pId=>{
    const project = gd.session.projects.get(pId);
    if (project) allCustomFields = allCustomFields.concat(project.customFields);
  });

  subprojects.map(p=>{
    const project = gd.session.projects.get(p.id);
    if (project) allCustomFields = allCustomFields.concat(project.customFields);
  });

  //project custom fields
  allCustomFields = allCustomFields.concat(project.customFields);

  let allTagsProjects = [];
  let allProjects = [project.id].concat(parentProjects);
  if (project.parentId) allProjects.push(project.parentId);

  const projectsSettings = [project.id].concat(gd.tree.findProjectParents(gd.tree.getProject(project.id)).map(p=>p.id));

  let allProjectTypes = project.projectTypeId ? [project.projectTypeId] : [];

  tasks.map(t=>{
    if (t.users) t.users.map(tu=>{allUsers.push(tu.userId)});
    if (t.actionRequiredUserId) allUsers.push(t.actionRequiredUserId);

    if (t.users && t.actionRequiredUserId && !t.users.map(tu=>tu.userId).includes(t.actionRequiredUserId)) {

      window.sentryLogger.captureMessageWarning(
        'ProjectTasksApp findMissingData error: actionRequiredUserId is not in users array',
        {
          users: t.users,
          actionRequiredUserId: t.actionRequiredUserId,
          tasks: tasks.slice()
        }
      );
    }

    const cfData = t.customFieldsData;
    for(let prop in cfData){ if (cfData.hasOwnProperty(prop)) allCustomFields.push(prop) }

    const taskType = gd.session.taskTypes.get(t.taskTypeId);
    if (taskType) allCustomFields = _.union(allCustomFields, taskType.customFields);

    if (t.tags && t.tags.length > 0) {
      allProjects = allProjects.concat(t.tags);
      allTagsProjects = allTagsProjects.concat(t.tags);
    }

    allProjects.push(t.projectId);
  });

  let uniqueTaskTypes = _.union(_.map(tasks, 'taskTypeId'), StructureControl.getTaskTypes(project.id));
  let uniqueStatuses = _.uniq(_.map(subprojects,'statusId').concat(_.map(tasks,'statusId')));
  let uniqueUsers = _.uniq(allUsers);

  //taskTypes custom fields
  uniqueTaskTypes.map(ttId=>{
    const tt = gd.session.taskTypes.get(ttId);
    if (tt) allCustomFields = allCustomFields.concat(tt.customFields);
  });

  _.map(subprojects, p=>{
    allProjects.push(p.id);
    if (!_.isEmpty(p.parentId))
      allProjects.push(p.parentId);
  });

  //allProjects required for missing subfolders of just created project from template
  //(subfolders are not added, no session project new event for them)
  const uniqueProjects = _.union(allProjects, allTagsProjects); //_.uniq(allTagsProjects);
  const uniqueProjectTypes = _.union(allProjectTypes, _.map(response.subprojects,'projectTypeId'));

  /*uniqueProjects && uniqueProjects.map(pId=>{
   const project = gd.session.projects.get(pId);
   if (project) allCustomFields = allCustomFields.concat(project.customFields);
   });*/

  const uniqueCustomFields = _.uniq(allCustomFields);

  return gd.session.findMissing({
    users: uniqueUsers,
    taskTypes: uniqueTaskTypes,
    statuses: uniqueStatuses,
    projects: uniqueProjects, //uniqueProjects required for Groups.groupByProject and for Closed to fill session.projects with closed projects
    projectsSettings: projectsSettings, //settings for columns presets
    //projectsWithParents: uniqueProjects, //required for closed projects
    customFields: uniqueCustomFields,
    projectTypes: uniqueProjectTypes
  });

}

export function appendNewProjectTask(data) {
  console.log('appendNewProjectTask', data);
  return (dispatch, getState) => {
    const { projectTasks: { project } } = getState();
    if (!project || project.id != data.projectId) {
      return;
    }
    return dispatch({
      type: PROJECT_TASKS_APPEND_NEW,
      data
    })
  }
}