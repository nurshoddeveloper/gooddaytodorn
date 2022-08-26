import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import me from './me';
import myWork from './my-work';
import task from './task';
import search from './search';
import favorites from './favorites';
import projectTasks from './project-tasks';
import events from './events';
import event from './event';
import activityStream from './activity-stream';
import rootScreen from './root-screen';
import time_report_reducer from './add-time-report';
import { FULL_STATE_RESET } from '../constants';

const appReducer = combineReducers({
  form: formReducer,
  me,
  myWork,
  task,
  search,
  favorites,
  projectTasks,
  events,
  event,
  activityStream,
  rootScreen,
  time_report_reducer
});

export default (state, action) => {
  if (action.type === FULL_STATE_RESET) {
    state = undefined;
  }

  return appReducer(state, action);
}
