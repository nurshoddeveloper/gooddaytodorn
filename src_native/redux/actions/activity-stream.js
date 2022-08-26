import Moment from 'moment';
import _ from 'lodash';
import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';
import {
  ACTIVITY_STREAM_LOAD
} from '../constants';
import SessionLoader from '../../../src_web/src_web_changed/core/gd/data/session-loader';
import ActivitiesCollection from '../../../src_web/src/core/gd-modules/activity-stream/models/activities';

export function loadActivityStream() {
  console.log('loadActivityStream');
  return (dispatch) => {
    return dispatch({
      type: ACTIVITY_STREAM_LOAD,
      payload: getActivityStreamData()
    });
  }
}


function getActivityStreamData() {

  return new Promise((resolve, reject) => {

    let activities = [];
    // const params = {
    //   startDate: Moment().subtract(14, 'days'),
    //   endDate: Moment(),
    // };
    const params = {
      startDate: gd.utils.momentToDate(Moment().subtract(7, 'days')),
      endDate: gd.utils.momentToDate(Moment())
    };

    let viewActivityStream;
    let viewAsCompany;
    let viewAsAll;
    gd.session.boardsMenu.forEach(bm => {
      if (bm.boardType === gd.const.views.ACTIVITY) {
        if (!viewAsAll && !bm.companyId) {
          viewAsAll = bm;
        }
        if (!viewAsCompany && bm.companyId) {
          viewAsCompany = bm;
        }
      }
    });
    viewActivityStream = viewAsAll || viewAsCompany;

    console.log('viewAsCompany', viewAsCompany)
    console.log('viewAsAll', viewAsAll)
    console.log('viewActivityStream', viewActivityStream)

    if (!viewActivityStream) {
      //no activity views
      const emptyCollection = new ActivitiesCollection([], {parse:true});
      const emptyGrouped = groupByFunction(emptyCollection.models, 'date');
      resolve(emptyGrouped);
      return;
    }



    //const dataLoader = apiCall(this, 'post', 'activity-stream', params);
    const dataLoader = apiCall(this, 'get', 'view/'+viewActivityStream.id, params);

    dataLoader.done(response => {

      // if (!fullResponse || !fullResponse.data) {
      //   reject();
      //   return;
      // }
      // const response = fullResponse.data;

      const filteredTaskMessages = [];
      const { FIRST, REASSIGN } = gd.const.taskMessage.type;
      const { isClosed } = gd.const.systemStatus;

      response.taskMessages && response.taskMessages.forEach(m => {
        const task = _.find(response.tasks, t => t.id === m.taskId);

        // from filter manager, exclude "empty" task updates
        const { type, message, taskStatusId, sysStatusNew, communicationFlow } = m;
        const showTm = (communicationFlow === FIRST)
          || (isClosed(sysStatusNew))
          || (taskStatusId)
          || (type < REASSIGN && message)
        ;

        if (showTm) filteredTaskMessages.push({
            id:                 m.id,
            momentCreated:      m.momentCreated,
            companyId:          m.companyId,
            projectId:          task.projectId,
            userId:             m.fromUserId,
            task:               task,
            taskMessage: {
              communicationFlow:  m.communicationFlow,
              message:            m.message,
              scheduleDate:       m.scheduleDate,
              sysStatusNew:       m.sysStatusNew,
              sysStatusOld:       m.sysStatusOld,
              toUserId:           m.toUserId,
              taskId:             m.taskId,
              taskStatusId:       m.taskStatusId,
              type:               m.type
            }
          }
        )
      });

      response.taskMessages = filteredTaskMessages;

      const { ACCOMPLISHED } = gd.const.eventHistory;

      response.eventUpdates = response.eventUpdates && response.eventUpdates.map(m=>{
        const event = _.find(response.events, e => e.id === m.eventId);
        return {
          id:                 m.id,
          momentCreated:      m.momentCreated,
          companyId:          m.companyId,
          projectId:          m.projectId,
          userId:             m.userId,
          event: {
            companyId:      event.companyId,
            type:           event.eventType,
            id:             event.id,
            name:           event.name,
            projectId:      event.projectId,
            isAccomplished: m.historyType === ACCOMPLISHED
          },
          eventUpdate: {
            assignedToUserId:   m.assignedToUserId,
            endDate:            m.endDate,
            eventId:            m.eventId,
            historyType:        m.historyType,
            notes:              m.notes,
            startDate:          m.startDate
          }
        }
      });

      response.projectUpdates = response.projectUpdates && response.projectUpdates.map(m=>{
        return {
          id:                 m.id,
          momentCreated:      m.momentCreated,
          companyId:          m.companyId,
          projectId:          m.projectId,
          userId:             m.userId,
          projectUpdate: {
            historyType:    m.historyType,
            newStatusId:    m.newStatusId,
            newSysStatus:   m.newSysStatus,
          }
        }
      });

      if (response.taskMessages) activities = activities.concat(response.taskMessages);
      if (response.eventUpdates) activities = activities.concat(response.eventUpdates);
      if (response.projectUpdates) activities = activities.concat(response.projectUpdates);

      getActivityStreamMissingData(response)
        .then(() => {
          const collection = new ActivitiesCollection(activities, {parse:true});
          const grouped = groupByFunction(collection.models, 'date');
          console.log('grouped', grouped);
          resolve(grouped);
        })
        .catch(error => {
          reject(error);
        });

    });

    dataLoader.fail(error => {
      if (error.code == 403) {
        reject(error);
      } else {
        reject(error);
      }
      window.sentryLogger.captureException(error);
    });

  });
}


function groupByFunction(arrItems, groupBy) {
  let result;
  switch (groupBy) {
    case 'date':
      result = _.chain(arrItems)
        .orderBy([a=>a.momentCreated.format("x")], ['desc'])
        .groupBy(a=>a.momentCreated.format("YYYY-MM-DD"))
        .value();
      break;
    case 'project': result = _.groupBy(arrItems,a=>a.projectId); break;
    case 'user':    result = _.groupBy(arrItems,a=>a.userId); break;
  }

  result = _.chain(result)
    .toPairs()
    .map(currentItem=>{
      const res = _.fromPairs(_.zip([groupBy, "updates"], currentItem));
      if (groupBy === 'date') res[groupBy] = res.updates[0].momentCreated;

      res.updates = groupByObject(res.updates);
      return res;
    })
    .value();

  switch (groupBy) {
    case 'project':
      result = _.orderBy(result, [m=>{
        const project = gd.session.projects.get(m.project);
        return project ? project.name : "";
      }, ],['asc']);
      break;
  }

  return result;
}

function groupByObject(arrItems) {
  return _.chain(arrItems)
  //group task messages in tasks
    .groupBy(m=>{
      if (m.task) return "task-"+m.task.id;
      if (m.event) return "event-"+m.event.id;
      if (m.projectUpdate) return "project-"+m.projectId;
    })
    .toPairs()
    .map(currentItem=>{
      const res =  _.fromPairs(_.zip(["id", "updates"], currentItem));
      const { projectId, task, event } = res.updates[0];
      if (projectId) res['project'] = gd.session.projects.get(projectId);
      if (task) res['task'] = task;
      if (event) res['event'] = event;

      res.updates = _.orderBy(res.updates, [a=>a.momentCreated.format("x")], ['desc']);

      delete res['id'];
      return res;
    })
    .value();
}


function getActivityStreamMissingData(events) {
  return new Promise((resolve, reject) => {

    const sessionLoader = new SessionLoader();
    sessionLoader.process(findMissingData(events));

    sessionLoader
      .then(() => {
        resolve(events); // events returned for action refreshEventsMissingData
      })
      .catch(error => {
        console.log('getEventsMissingData reject', error);
        reject(error);
        window.sentryLogger.captureException(error);
      });

  });
}

function findMissingData(data) {
  if (!data) return false;

  let allUsers = [];
  let allTaskTypes = [];
  let allStatuses = [];
  let allProjects = [];
  const { tasks, taskMessages, eventUpdates, projectUpdates } = data;

  if (tasks) {
    allTaskTypes = _.map(tasks,'taskTypeId');
    allProjects = _.map(tasks,'projectId');
  }

  if (taskMessages) {
    taskMessages.map(tu => {
      const { taskStatusId } = tu.taskMessage;
      if (tu.userId) allUsers.push(tu.userId);
      if (taskStatusId) allStatuses.push(taskStatusId);
    });
  }

  if (eventUpdates) {
    eventUpdates.map(eu => {
      const { projectId, userId, assignedToUserId } = eu;
      if (userId) allUsers.push(userId);
      if (assignedToUserId) allUsers.push(assignedToUserId);
      if (projectId) allProjects.push(projectId);
    })
  }

  if (projectUpdates) {
    projectUpdates.map(eu => {
      const { projectId, userId, projectUpdate } = eu;
      const { newStatusId } = projectUpdate;
      if (userId) allUsers.push(userId);
      if (newStatusId) allStatuses.push(newStatusId);
      if (projectId) allProjects.push(projectId);
    })
  }

  return gd.session.findMissing({
    users: _.uniq(allUsers),
    taskTypes: _.uniq(allTaskTypes),
    statuses: _.uniq(allStatuses),
    projectsWithParents: _.uniq(allProjects)
  });
}
