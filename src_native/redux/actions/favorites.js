import _ from 'lodash';
import {
  FAVORITES_LOAD
} from '../constants';
import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';
import SessionLoader from '../../../src_web/src_web_changed/core/gd/data/session-loader';


export function loadFavorites() {
  console.log('search action');
  return {
    type: FAVORITES_LOAD,
    //payload: apiCall(this, 'get', 'starred-items')
    payload: getFavoritesData()
  }
}

function getFavoritesData() {

  return new Promise((resolve, reject) => {

    const dataLoader = apiCall(this, 'get', 'starred-items');
    const sessionLoader = new SessionLoader();
    let projects = [];
    let tasks = [];

    dataLoader.done(response => {
      //console.log('response', response);
      projects = response.projects || [];
      tasks = response.tasks || [];
      sessionLoader.process(findMissingData(projects, tasks));
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

        // add pins to tasks too
        let taskList = [];
        let excludeTasks = [];
        gd.session.pins.map(p => {
          if (p.task) {
            let t = p.task;
            //try to find task
            let ft = tasks.find(el => el.id === p.task.id);
            if (ft) {
              t = ft;
            } else {
              ft = gd.session.myWork.findTaskById(p.task.id);
              if (ft) t = ft;
            }

            t.pin = true;
            taskList.push(t);
            excludeTasks.push(p.task.id);
          }
        });
        tasks.map(t => {
          if (excludeTasks.indexOf(t.id) == -1) {
            taskList.push(t)
          }
        });

        // add pins to projects too
        let projectList = [];
        let excludeProejcts = [];
        gd.session.pins.map(p => {
          if (p.project) {
            let p2 = p.project;
            //try to find project
            let fp = projects.find(el => el.id === p.project.id);
            if (fp) {
              p2 = fp;
            } else {
              fp = gd.session.projects.get(p2.id);
              if (fp) p2 = fp;
            }

            p2.pin = true;
            projectList.push(p2);
            excludeProejcts.push(p.project.id);
          }
        });
        projects.map(p3 => {
          if (excludeProejcts.indexOf(p3.id) == -1) {
            projectList.push(p3);
          }
        });

        resolve({projects: projectList, tasks: taskList});

      })
      .catch(error => {
        console.log('getFavoritesData sessionLoader reject', error);
        reject(error);
        window.sentryLogger.captureException(error);
      });

  });
}

function findMissingData(tasks, projects) {
  if (!tasks && !projects) return false;

  let allUsers = [];
  let allTaskTypes = [];
  let allStatuses = [];
  let allProjects = [];

  tasks && tasks.map(t=>{
    allProjects.push(t.projectId);
    allTaskTypes.push(t.taskTypeId);
    allUsers.push(t.actionRequiredUserId);
    allStatuses.push(t.statusId);
  });

  projects && projects.map(p=>{
    allProjects.push(p.id);
    allStatuses.push(p.statusId);
  });

  // pins
  gd.session.pins.map(p => {
    if (p.task) allTaskTypes.push(p.taskTypeId);
    if (p.project) allProjects.push(p.project.id);
  });

  return gd.session.findMissing({
    users: _.uniq(allUsers),
    taskTypes: _.uniq(allTaskTypes),
    statuses: _.uniq(allStatuses),
    projects: _.uniq(allProjects)
  });
}
