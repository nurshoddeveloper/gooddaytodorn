import Moment from 'moment';
import _ from 'lodash';
import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';
import {
  EVENT_LOAD,
  EVENT_UPDATE_STARTEND,
  EVENT_UPDATE_ACCOMPLISHED,
  EVENT_UPDATE_ASSIGNED,
  EVENT_UPDATE_NOTES,
  EVENT_DELETE
} from '../constants';
import SessionLoader from '../../../src_web/src_web_changed/core/gd/data/session-loader';
const EventModel = require('../../../src_web/src/core/gd-model/event/event');

export function loadEvent(eventId) {
  console.log('loadEvent', eventId);
  return (dispatch) => {
    return dispatch({
      type: EVENT_LOAD,
      payload: getEventData(eventId)
    });
  }
}

function getEventData(eventId) {

  return new Promise((resolve, reject) => {

    const dataLoader = apiCall(this, 'get', 'event/' + eventId);

    dataLoader.done(response => {
      //console.log('response', response);
      const event = new EventModel(response, {parse:true});
      resolve(event);

      getEventMissingData(event)
        .then(() => { resolve(event) })
        .catch(error => { reject(error) });
    });

    dataLoader.fail((error)=>{
      if (error.code == 403) {
        reject(error);
      } else {
        reject(error);
      }
    });

  });
}

function getEventMissingData(event) {
  return new Promise((resolve, reject) => {

    const sessionLoader = new SessionLoader();
    sessionLoader.process(findEventMissingData(event));

    sessionLoader
      .then(() => {
        resolve();
      })
      .catch(error => {
        console.log('getEventMissingData reject', error);
        reject(error);
        window.sentryLogger.captureException(error);
      });

  });
}

function findEventMissingData(event) {
  if (!event) return false;

  const allProjects = [];
  const allUsers = [];

  if (event.projectId) allProjects.push(event.projectId);
  if (event.project && event.project.id) allProjects.push(event.project.id);

  if (event.userId) allUsers.push(event.userId);
  if (event.user && event.user.id) allUsers.push(event.user.id);

  if (event.assignedToUserId) allUsers.push(event.assignedToUserId);
  if (event.assignedToUserId && event.assignedToUser.id) allUsers.push(event.assignedToUser.id);

  return gd.session.findMissing({
    users: _.uniq(allUsers),
    projects: _.uniq(allProjects)
  });
}

export function updateEventStartend(event) {
  console.log('updateEventStartend', event.id);

  const endDate = (event.endDate && Moment(event.endDate).endOf('day').isAfter(Moment(event.startDate).startOf('day'))) ? event.endDate : null;

  const params = {
    startDate: gd.utils.momentToDate(event.startDate),
    endDate: gd.utils.momentToDate(endDate)
  };
  console.log('params', params);

  return {
    type: EVENT_UPDATE_STARTEND,
    payload: new Promise((resolve, reject) => {
      apiCall(this, 'put', 'event/' + event.id + '/start-end', params)
        .then(() => {
          gd.bus.triggerEvent('event-change');
          resolve();
        })
        .catch(reject);
    })
  }
}

export function updateEventAccomplished(event) {
  console.log('updateEventAccomplished', event.id, event.isAccomplished);

  const params = {
    isAccomplished: event.isAccomplished
  };

  return {
    type: EVENT_UPDATE_ACCOMPLISHED,
    payload: new Promise((resolve, reject) => {
      apiCall(this, 'put', 'event/' + event.id + '/accomplished', params)
        .then(() => {
          gd.bus.triggerEvent('event-change');
          resolve();
        })
        .catch(reject);
    })
  }
}

export function updateEventAssigned(event) {
  console.log('updateEventAssigned', event.id, event.assignedToUser.id);

  const params = {
    userId: event.assignedToUser.id
  };

  return {
    type: EVENT_UPDATE_ASSIGNED,
    payload: new Promise((resolve, reject) => {
      apiCall(this, 'put', 'event/' + event.id + '/assign', params)
        .then(() => {
          gd.bus.triggerEvent('event-change');
          resolve();
        })
        .catch(reject);
    })
  }
}

export function updateEventNotes(event) {
  console.log('updateEventNotes', event.id, event.notes);

  const params = {
    notes: event.notes
  };

  return {
    type: EVENT_UPDATE_NOTES,
    payload: new Promise((resolve, reject) => {
      apiCall(this, 'put', 'event/' + event.id + '/notes', params)
        .then(() => {
          gd.bus.triggerEvent('event-change');
          resolve();
        })
        .catch(reject);
    })
  }
}

export function deleteEvent(eventId) {
  return {
    type: EVENT_DELETE,
    payload: new Promise((resolve, reject) => {
      apiCall(this, 'delete', 'event/' + eventId)
        .then(() => {
          gd.bus.triggerEvent('event-delete');
          resolve();
        })
        .catch(reject);
    })
  }
}