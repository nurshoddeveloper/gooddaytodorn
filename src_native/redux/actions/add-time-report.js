import {ADD_TIME_REPORT,ADD_TIME_REPORT_FULFILLED,ADD_TIME_REPORT_REJECTED} from '../constants'
import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';
import _ from 'lodash';

export function addtimereport(reportObj) {
  console.log('reportObj',reportObj)
    return dispatch => {
      return new Promise((resolve, reject) => {
        apiCall(this, 'post', 'my-time/time-report', reportObj)
        .then(data => {
          console.log('createTask data', data);
          gd.session.recent.tasks.taskView(data.task); // add task to recent
          if (task.parentTask) gd.bus.triggerEvent('subtask:add', data.task);

          // add task to project tasks, when created from projects screen
          dispatch(appendNewProjectTask(data.task));

          resolve();
        })
        .catch(reject);
    });
    }
}
