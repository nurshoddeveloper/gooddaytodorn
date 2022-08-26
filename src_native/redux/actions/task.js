import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';
import SessionLoader from '../../../src_web/src_web_changed/core/gd/data/session-loader';
import _ from 'lodash';
import Moment from 'moment';
import {
  TASK_LOAD,
  TASK_LOAD_FULFILLED,
  TASK_UPDATE_STATUS,
  TASK_UPDATE_PRIORITY,
  TASK_UPDATE_SCHEDULE,
  TASK_UPDATE_START_END,
  TASK_UPDATE_DEADLINE,
  TASK_UPDATE_ESTIMATE,
  TASK_UPDATE_PROGRESS,
  TASK_UPDATE_AR_USER,
  TASK_REPLY,
  TASK_CUSTOM_FIELDS,
  TASK_DELETE_MESSAGE,
  TASK_UPDATE_MESSAGE,
  TASK_MOVE_TO_FOLDER,
  TASK_RENAME,
  TASK_DELETE,
  TASK_UPLOAD_ATTACHMENT
} from '../constants';
const DatetimeUtils = require('../../../src_web/src/core/gd/utils/datetime-utils');
const HierarchyCollection = require('../../../src_web/src/core/gd-model/task/hierarchy/gd-hierarchy');
import { appendNewProjectTask } from './project-tasks';

export function createTask(task) {

  return dispatch => {
    return new Promise((resolve, reject) => {
      //for test
      //Promise.resolve()
      apiCall(this, 'post', 'new-task', task)
        .then(data => {
          console.log('createTask data', data);
          gd.session.recent.tasks.taskView(data.newTask); // add task to recent
          if (task.parentTask) gd.bus.triggerEvent('subtask:add', data.newTask);

          // add task to project tasks, when created from projects screen
          dispatch(appendNewProjectTask(data.newTask));

          resolve();
        })
        .catch(reject);
    });
  }
}


export function loadTask(taskId) {
  console.log('loadTask', taskId);
  return (dispatch) => {
    return dispatch({
      type: TASK_LOAD,
      payload: getTaskData(taskId)
    });
  }
}


function getTaskData(taskId) {

  return new Promise((resolve, reject) => {

    const dataLoader = apiCall(this, 'get', 'task/' + taskId);
    const sessionLoader = new SessionLoader();
    let responseTask = null;

    dataLoader.done(response => {
      //console.log('response', response);
      responseTask = response;
      sessionLoader.process(findMissingData(responseTask));
    });

    dataLoader.fail((error) => {
      if (error.code == 403) {
        //gd.growl.removeAll();
        //return this.renderNoAccess();
        reject(error);  // possible unhandled promise rejection warning
      } else {
        //gd.apiError();
        reject(error);
      }
    });
    sessionLoader
      .then(() => {

        const task = parseTaskData(responseTask);

        // listen to task reset events
        gd.presence.navigate('task-view', taskId);

        resolve(task);
      })
      .catch(error => {
        console.log('getTaskData sessionLoader reject', error);
        reject(error);
      });

  });
}

export function updateTaskStatus(task, newStatusId) {
  console.log('updateTaskStatus', task.id, task.taskStatusId, newStatusId);
  const params = { status: newStatusId, actionRequiredUser: task.actionRequiredUserId };
  return {
    type: TASK_UPDATE_STATUS,
    payload: apiCall(this, 'put', 'task/' + task.id + '/status', params)
  }
}

export function updateTaskPriority(task, newPriority) {
  console.log('updateTaskPriority', task.id, task.priority, newPriority);
  return {
    type: TASK_UPDATE_PRIORITY,
    payload: apiCall(this, 'put', 'task/' + task.id + '/priority', { priority: newPriority })
  }
}
//task custom fields
export function updateCustomFields(task, customFieldId, newFields, type) {
  console.log('updateCustomFields', task.id, task.customFieldsData, customFieldId, newFields);
  const data = { customFieldId: customFieldId, newValue: { type: type, value: newFields }, taskReset: true }
  return {
    type: TASK_CUSTOM_FIELDS,
    payload: apiCall(this, 'put', 'task/' + task.id + '/custom-fields', data)
  }
}
export function updateTaskSchedule(task, schedule) {
  console.log('updateTaskSchedule', task.id, schedule);
  const params = {};
  if (schedule == 'someday') {
    params.someday = true;
  } else if (Moment.isMoment(schedule)) {
    params.date = schedule.format('YYYY-MM-DD');
  }
  console.log('updateTaskSchedule params', params);
  return {
    type: TASK_UPDATE_SCHEDULE,
    payload: apiCall(this, 'post', 'task/' + task.id + '/schedule', params)
  }
}

export function updateTaskStartEnd(task, startDate, endDate) {
  console.log('updateTaskStartEnd', task.id, startDate, endDate);

  if (!endDate) startDate = endDate;
  if (!startDate || (endDate && endDate.isBefore(startDate))) {
    endDate = startDate;
  }

  // only ar-user may set schedule
  const scheduleDate = task.actionRequiredUserId && task.actionRequiredUserId == gd.session.me.id ? task.scheduleDate : null;
  let newScheduleDate;
  if (scheduleDate && Moment.isMoment(scheduleDate)) {
    if ((scheduleDate.isBefore(startDate, 'day') || scheduleDate.isAfter(endDate, 'day'))) {
      // if start date is before today -> today else startDate
      if (startDate.isBefore(Moment())) {
        newScheduleDate = Moment(); // today
      } else {
        newScheduleDate = startDate;
      }
    }
  }

  const params = {
    startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
    endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
    taskReset: true,
  };
  if (newScheduleDate) {
    params.newScheduleDate = newScheduleDate.format('YYYY-MM-DD');
  }

  // save in task object
  task.startDate = startDate;
  task.endDate = endDate;
  if (newScheduleDate) task.scheduleDate = newScheduleDate;

  return {
    type: TASK_UPDATE_START_END,
    payload: apiCall(this, 'put', 'task/' + task.id + '/start-end', params)
  }
}

export function updateTaskDeadline(task, deadline) {
  console.log('updateTaskDeadline', task.id, deadline);
  const params = {
    deadline: Moment.isMoment(deadline) ? deadline.format('YYYY-MM-DD') : null,
  };
  console.log('updateTaskDeadline params', params);
  return {
    type: TASK_UPDATE_DEADLINE,
    payload: apiCall(this, 'put', 'task/' + task.id + '/deadline', params)
  }
}

export function updateTaskEstimate(task, estimate) {
  console.log('updateTaskEstimate', task.id, estimate);
  return {
    type: TASK_UPDATE_ESTIMATE,
    payload: apiCall(this, 'put', 'task/' + task.id + '/estimate', { estimate })
  }
}

export function updateTaskProgress(task, progress) {
  console.log('updateTaskProgress', task.id, progress);
  return {
    type: TASK_UPDATE_PROGRESS,
    payload: apiCall(this, 'put', 'task/' + task.id + '/progress', { progress })
  }
}

export function updateTaskArUser(task, arUserId) {
  console.log('updateTaskArUser', task.id, arUserId);
  return {
    type: TASK_UPDATE_AR_USER,
    payload: apiCall(this, 'put', 'task/' + task.id + '/ar-user', { actionRequiredUser: arUserId })
  }
}

export function replyTask(task, values) {
  console.log('replyTask', task.id, values);
  return {
    type: TASK_REPLY,
    payload: apiCall(this, 'post', 'task/' + task.id + '/reply', values)
    //payload: Promise.reject('bad')
  }
}

export function deleteTaskMessage(task, messageID) {
  console.log('deleteTaskMessage', task.id, messageID);
  return {
    type: TASK_DELETE_MESSAGE,
    payload: apiCall(this, 'delete', 'task/' + task.id + '/message/' + messageID)
  }
}

export function updateTaskMessage(task, message, text) {
  console.log('updateTaskMessage', task.id, message, text);
  const messageID = message?.id
  const params = {
    attachments: message?.attachments,
    message: text
  }
  return {
    type: TASK_UPDATE_MESSAGE,
    payload: apiCall(this, 'put', 'task/' + task.id + '/message/' + messageID, params)
  }
}

export function deleteTask(task) {
  console.log('deleteTask', task.id);
  return {
    type: TASK_DELETE,
    payload: apiCall(this, 'delete', 'task/' + task.id)
  }
}

export function moveTaskToFolder(task, projectId, companyId) {
  console.log('moveTaskToFolder', task.id);
  const params = {
    cid: companyId,
    projectId,
    newProjectUsers: [],
    sortPosition: null
  }
  return {
    type: TASK_MOVE_TO_FOLDER,
    payload: apiCall(this, 'PUT', 'task/' + task.id + '/move-to-project', params)
  }
}

export function changeTaskName(task, text) {
  console.log('changeTaskName', task.id, text);
  const params = {
    title: text
  }
  return {
    type: TASK_RENAME,
    payload: apiCall(this, 'put', 'task/' + task.id + '/title', params)
  }
}

export function uploadAttachment(file) {
  const formdata = new FormData()
  formdata.append('files', file)

  const headers = {
    'Content-type': 'multipart/form-data'
  }

  console.log('uploadAttachment', formdata, file);
  return {
    type: TASK_UPLOAD_ATTACHMENT,
    payload: apiCall(this, 'post', 'attachment/upload', null, headers, formdata)
  }
}


export function receiveTaskGdSession(data) {
  return (dispatch, getState) => {

    if (!data || !data.id) return;

    const { task } = getState();
    if (task.task == null || task.task.id != data.id) {
      return;
    }

    return new Promise((resolve, reject) => {

      const sessionLoader = new SessionLoader();
      sessionLoader.process(findMissingData(data));
      sessionLoader
        .then(() => {
          const freshTask = parseTaskData(data);
          dispatch({
            type: TASK_LOAD_FULFILLED,
            payload: freshTask,
          });
          resolve();
        })
        .catch(reject);
    });

    /*
    return dispatch({
      type: TASK_LOAD,
      payload: new Promise((resolve, reject) => {
        const sessionLoader = new SessionLoader();
        sessionLoader.process(findMissingData(data));
        sessionLoader
          .then(() => {
              const freshTask = new TaskFullModel(data, {parse:true});
              resolve(freshTask);
            }
          )
          .catch(reject);
      })
    });
    */
  }
}


function findMissingData(task) {
  if (!task) return false;

  let allUsers = [];
  let allTaskTypes = [task.taskTypeId];
  let allProject = [task.projectId];
  let allStatuses = [];
  let allCustomFields = [];

  // USERS
  if (task.createdByUserId) allUsers.push(task.createdByUserId);
  if (task.createdForUserId) allUsers.push(task.createdForUserId);
  if (task.assignedToUserId) allUsers.push(task.assignedToUserId);
  if (task.actionRequiredUserId) allUsers.push(task.actionRequiredUserId);
  if (task.createdOnBehalfByUserId) allUsers.push(task.createdOnBehalfByUserId);

  task.users.map(u => {
    allUsers.push(u.userId);
  });

  // MESSAGES
  task.messages.map(m => {
    const { fromUserId, toUserId, editByUserId, taskStatusId } = m;
    if (fromUserId) allUsers.push(fromUserId);
    if (toUserId) allUsers.push(toUserId);
    if (editByUserId) allUsers.push(editByUserId);

    if (taskStatusId) allStatuses.push(taskStatusId);
  });

  // HIERARCHY
  task.hierarchyFull.tasks.map(t => {
    allTaskTypes.push(t.taskTypeId);
    allProject.push(t.projectId)
  });

  task.hierarchyFull.projects.map(p => {
    allProject.push(p.id)
  });

  // CUSTOM FIELDS
  const cfData = task.customFieldsData;
  for (let prop in cfData) {
    if (cfData.hasOwnProperty(prop)) {
      allCustomFields.push(prop)
    }
  }

  const taskType = gd.session.taskTypes.get(task.taskTypeId);
  if (taskType) allCustomFields = _.union(allCustomFields, taskType.customFields);

  const project = gd.session.projects.get(task.projectId);
  if (project) allCustomFields = _.union(allCustomFields, project.customFields);

  //collect parent projects custom fields
  const parentProjects = gd.tree.findProjectParents(gd.tree.getProject(task.projectId)).map(p => p.id);
  parentProjects && parentProjects.map(pId => {
    const project = gd.session.projects.get(pId);
    if (project) allCustomFields = allCustomFields.concat(project.customFields);
  });


  return gd.session.findMissing({
    users: _.uniq(allUsers),
    taskTypes: _.uniq(allTaskTypes),
    projects: _.uniq(allProject),
    customFields: _.uniq(allCustomFields),
    statuses: _.uniq(allStatuses)
  });
}


function parseTaskData(raw) {
  // hierarchy
  const hierarchyItems = [];
  raw.hierarchyFull.projects && raw.hierarchyFull.projects.map(p => { hierarchyItems.push({ type: 'project', item: p }); });
  raw.hierarchyFull.tasks && raw.hierarchyFull.tasks.map(t => { hierarchyItems.push({ type: 'task', item: t }); });

  const hierarchy = new HierarchyCollection(hierarchyItems, { parse: true });
  hierarchy.updateChildrenItems();

  const task = {

    id: raw.id,
    isTemplate: raw.isTemplate,

    companyId: raw.companyId,
    projectId: raw.projectId,
    parentTaskId: raw.parentTaskId,

    title: raw.title,

    taskTypeId: raw.taskTypeId,
    systemType: raw.systemType,
    shortId: raw.shortId,

    taskStatusId: raw.taskStatusId, // taskStatusId = statusId
    statusId: raw.taskStatusId,
    systemStatus: raw.systemStatus,

    actionRequiredUserId: raw.actionRequiredUserId,
    actionRequiredSinceDate: DatetimeUtils.datetimeToMoment(raw.actionRequiredSinceDate),
    scheduleStatus: raw.scheduleStatus,
    scheduleDate: DatetimeUtils.dateToMoment(raw.scheduleDate),

    assignedToUserId: raw.assignedToUserId,

    source: raw.source,
    createdByUserId: raw.createdByUserId,
    createdOnBehalfByUserId: raw.createdOnBehalfByUserId,
    momentCreated: DatetimeUtils.datetimeToMoment(raw.dateCreated),


    deadline: DatetimeUtils.dateToMoment(raw.deadline),
    startDate: DatetimeUtils.dateToMoment(raw.startDate),
    endDate: DatetimeUtils.dateToMoment(raw.endDate),
    priority: raw.priority,
    progress: raw.progress,
    recurrency: raw.recurrency,


    estimate: raw.estimate,
    gmailMessageId: raw.gmailMessageId,

    latestActivityMoment: DatetimeUtils.datetimeToMoment(raw.latestActivityDate),


    // Advanced fields
    users: raw.users,
    customFieldsData: raw.customFieldsData,
    hierarchy: hierarchy,
    tags: raw.tags,
    timeReports: raw.timeReports,

    // DERRIVED
    isOpen: !(raw.systemStatus == 5 || raw.systemStatus == 6),
    //isSelfTask: raw.users.length < 2 //should be set after messages processing in case user is deleted, but has related messages

  };


  // CHECKLIST
  task.checklist = raw.checklist;
  // check if non empty + not neededhere
  // taks.checklist.map((checklistItem,key)=>{
  //     checklistItem.realKey = key
  // });

  // deal with related tasks (!)
  task.relatedTasks = {
    parent: null,
    subtasks: null,
    siblings: null,
    dependensOn: null,
    dependentTasks: null
  };
  const relatedTasksDict = {};
  if (raw.relatedTasks.tasksData) {
    raw.relatedTasks.tasksData.map(t => {
      relatedTasksDict[t.id] = t;
    });
  }


  // 1 for sub task
  if (task.systemType == 2) {
    task.relatedTasks.parentTask = relatedTasksDict[raw.parentTaskId];
    if (raw.relatedTasks.siblings) {
      const siblings = raw.relatedTasks.siblings.map(taskId => relatedTasksDict[taskId]);
      task.relatedTasks.siblings = siblings;
    }
  }

  // 2 for task
  if (task.systemType == 1) {
    if (raw.relatedTasks.subtasks) {
      const subtasks = _.orderBy(raw.relatedTasks.subtasks.map(taskId => relatedTasksDict[taskId]), ["sortPosition"], ["asc"]);
      task.relatedTasks.subtasks = subtasks;
    }
  }
  // 3 dependencies
  if (raw.relatedTasks.dependencies) {
    raw.relatedTasks.dependencies.map(dependency => {

      // i am parent -> dependent tasks
      if (task.id == dependency.task1Id) {
        if (!task.relatedTasks.dependentTasks) task.relatedTasks.dependentTasks = [];
        const newDependentTask = relatedTasksDict[dependency.task2Id];
        newDependentTask.dependencyType = dependency.type;
        newDependentTask.dependencyId = dependency.id;
        task.relatedTasks.dependentTasks.push(newDependentTask);
      }

      // depends on
      if (task.id == dependency.task2Id) {
        if (!task.relatedTasks.dependsOn) task.relatedTasks.dependsOn = [];
        const newDependensOnTask = relatedTasksDict[dependency.task1Id];
        newDependensOnTask.dependencyType = dependency.type;
        newDependensOnTask.dependencyId = dependency.id;
        task.relatedTasks.dependsOn.push(newDependensOnTask);
      }
    });
  }

  // Process messages
  const messages = raw.messages;
  const messagesUsers = [];

  messages.map(m => {
    m.momentCreated = DatetimeUtils.datetimeToMoment(m.dateCreated);
    m.scheduleDate = DatetimeUtils.dateToMoment(m.scheduleDate);

    m.arUserReplyTime = (m.arUserReplyTimeMinutes) ? Moment.duration(m.arUserReplyTimeMinutes, 'minutes') : null;
    m.getBackTime = (m.getBackTime) ? Moment.duration(m.getBackTime, 'minutes') : null;

    gd.utils.addValueToArray(messagesUsers, m.fromUserId);
    gd.utils.addValueToArray(messagesUsers, m.toUserId);
  });


  task.messages = messages;
  task.isSelfTask = messagesUsers.length < 2;

  return task;
}
