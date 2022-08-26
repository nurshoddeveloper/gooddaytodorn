import Moment from 'moment';
import _ from 'lodash';
import { AR_NO_ACTION_REQUIRED } from './constants';

export function getMyWorkTitle(folder) {
  let title = 'My Work';

  switch (folder) {
    case 'inbox': title = "Inbox"; break;
    case 'today': title = "Today"; break;
    case 'pastdue': title = "Pastdue"; break;
    case 'someday': title = "Someday"; break;
    default:
      title = gd.utils.momentHumanize(Moment(folder),'dddd, MMM D');
      break;
  }

  return title;
}

export function getMyWorkFilterFolderName(folder) {
  let filterFolderName;

  switch (folder) {
    case 'pastdue':
    case 'inbox':
    case 'today':
      filterFolderName = folder;
      break;

    case 'tomorrow':
      filterFolderName = 'day-' + Moment().add(1,'days').format("YYYY-MM-DD");
      break;
    default:
      filterFolderName = 'day-' + folder;
      break;
  }

  return filterFolderName;
}

// some old tasks have incorrect statuses, example: l3V0C7
export function getSafeTaskStatus(taskTypeId, taskStatusId) {
  let taskStatus = null;

  // correct try
  const taskType = gd.session.taskTypes.get(taskTypeId);
  if (taskType) {
    const taskStatusItem = taskType.statuses.getByStatusId(taskStatusId);
    if (taskStatusItem) taskStatus = taskStatusItem.status;
  }

  // failsafe as in web
  if (!taskStatus) {
    taskStatus = gd.session.statuses.get(taskStatusId);
  }

  return taskStatus || { id: '', name: 'unknown', color: 1 }
}

export function getSafeProjectStatus(project) {
  let projectStatus = null;

  const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;

  // /www/goodday2/src/core/gd-components/project-status-selector/project-status.jsx
  let options = [];
  switch (project.systemType) {
    case PROJECT:
      const pt = gd.session.projectTypes.get(project.projectTypeId);
      if (pt) {
        options = pt.statuses.map(projectStatus=>{
          return {
            value: projectStatus.status.id,
            label: projectStatus.status.name,
            color: projectStatus.status.color
          }
        });
      }
      /*
      else {
        console.log('ddd', project);
        // fail safe
        const { NOT_STARTED, IN_PROGRESS, IN_REVIEW, ON_HOLD, COMPLETED, CANCELLED } = gd.const.systemStatus;
        options = [
          {
            value: NOT_STARTED,
            label: gd.const.systemStatusList[1],
            color: 1
          },
          {
            value: IN_PROGRESS,
            label: gd.const.systemStatusList[2],
            color: 11
          }
        ];
        console.log('options', options);
      }
      */
      break;

    case TAG:
    case WORKFOLDER:
    case BACKLOG:
      const { workfolderStatus, workfolderStatusList } = gd.const.project;
      const { OPEN, CLOSED } = workfolderStatus;
      options = [{
        value: OPEN,
        label: workfolderStatusList[OPEN],
        color: 5
      },{
        value: CLOSED,
        label: workfolderStatusList[CLOSED],
        color: 11
      }];
      break;

    case SPRINT:
      const { sprintStatus, sprintStatusList } = gd.const.project;
      const { NOT_STARTED, IN_PROGRESS, IN_REVIEW, COMPLETED } = sprintStatus;

      options = [{
        value: NOT_STARTED,
        label: sprintStatusList[NOT_STARTED],
        color: 2
      },{
        value: IN_PROGRESS,
        label: sprintStatusList[IN_PROGRESS],
        color: 5
      },{
        value: IN_REVIEW,
        label: sprintStatusList[IN_REVIEW],
        color: 9
      },{
        value: COMPLETED,
        label: sprintStatusList[COMPLETED],
        color: 11
      }];
      break;
  }

  let valueObj = null;
  const value = getProjectStatusValue(project);
  if (value) {
    valueObj = _.find(options, (o)=>o.value === value);
    if (valueObj) {
      //valueLabel = valueObj.label;
      //valueClass = 'status-color-'+valueObj.color;
      projectStatus = valueObj;
      projectStatus.name = valueObj.label;
    }
  }

  return projectStatus || { id: '', name: 'unknown', color: 1 }
}

function getProjectStatusValue(project) {
  const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;

  let value = null;
  switch (project.systemType) {
    case PROJECT:
      value = project.statusId; break;
    case WORKFOLDER:
    case BACKLOG:
    case SPRINT:
    case TAG:
      value = project.systemStatus; break;
  }

  return value;
}



export function createNoArUser(createTaskMode=false) {
  return {
    id: AR_NO_ACTION_REQUIRED,
    name: createTaskMode ? 'Not assigned' : 'No action required'
  }
}


export function isNumeric(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}
