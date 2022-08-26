import Moment from 'moment';
import _ from 'lodash';
import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';
import {
  EVENTS_LOAD
} from '../constants';
import SessionLoader from '../../../src_web/src_web_changed/core/gd/data/session-loader';
import EventsCollection  from '../../../src_web/src/core/gd-model/event/event-basic-collection';


export function loadEvents() {
  console.log('loadEvents');
  return (dispatch) => {
    return dispatch({
      type: EVENTS_LOAD,
      //payload: new Promise((resolve,reject) => { resolve(null) })
      payload: getEventsData()
    });
  }
}

export function refreshEventsMissingData() {
  console.log('refreshEventsMissingData');
  return (dispatch, getState) => {
    const { events: { events } } = getState();
    return dispatch({
      type: EVENTS_LOAD,
      payload: getEventsMissingData(events)
    });
  }
}

function getEventsData() {

  return new Promise((resolve, reject) => {

    const params = {
      startDate: gd.utils.momentToDate(Moment().subtract(6, 'months')),
      endDate: gd.utils.momentToDate(Moment().add(12, 'months'))
    };
    const dataLoader = apiCall(this, 'get', 'events', params);

    dataLoader.done(response => {
      const list = response.events || [];
      const events = new EventsCollection(list, {parse:true});

      getEventsMissingData(events)
        .then(() => {
          resolve(events);
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

function getEventsMissingData(events) {
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

function findMissingData(events) {
  if (!events) return false;

  let allUsers = [];
  let allProjects = [];

  events.map(e => {
    if (e.projectId) allProjects.push(e.projectId);
    if (e.userId) allUsers.push(e.userId);
    if (e.assignedToUserId) allUsers.push(e.assignedToUserId);
  });

  return gd.session.findMissing({
    users: _.uniq(allUsers),
    projects: _.uniq(allProjects)
  });
}
