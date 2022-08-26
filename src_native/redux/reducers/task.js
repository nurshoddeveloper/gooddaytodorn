import {
  TASK_LOAD_PENDING,
  TASK_LOAD_FULFILLED,
  TASK_LOAD_REJECTED,
  TASK_UPDATE_STATUS_FULFILLED,
  TASK_UPDATE_STATUS_REJECTED,
  TASK_UPDATE_PRIORITY_FULFILLED,
  TASK_UPDATE_PRIORITY_REJECTED,
  TASK_UPDATE_SCHEDULE_FULFILLED,
  TASK_UPDATE_SCHEDULE_REJECTED,
  TASK_UPDATE_DEADLINE_FULFILLED,
  TASK_UPDATE_DEADLINE_REJECTED,
  TASK_UPDATE_START_END_FULFILLED,
  TASK_UPDATE_START_END_REJECTED,
  TASK_UPDATE_ESTIMATE_FULFILLED,
  TASK_UPDATE_ESTIMATE_REJECTED,
  TASK_UPDATE_PROGRESS_FULFILLED,
  TASK_UPDATE_PROGRESS_REJECTED,
  TASK_CUSTOM_FIELDS_FULFILLED,
  TASK_CUSTOM_FIELDS_REJECTED,
  TASK_DELETE_MESSAGE_FULFILLED,
  TASK_DELETE_MESSAGE_REJECTED
} from '../constants';

const initialState = {
  task: null,
  isFetching: false,
  error: false,
  errorObj: null
};

export default function taskReducer(state = initialState, action) {
  switch (action.type) {
    case TASK_LOAD_PENDING:
      console.log('taskReducer', action.type);
      return {
        ...initialState,
        isFetching: true
      };
    case TASK_LOAD_FULFILLED:
      console.log('taskReducer', action.type);
      return {
        ...state,
        isFetching: false,
        task: action.payload
      };
    case TASK_LOAD_REJECTED:
      console.log('taskReducer', action.type);
      return {
        ...state,
        isFetching: false,
        error: true,
        errorObj: action.payload
      };
    case TASK_UPDATE_STATUS_FULFILLED:
    case TASK_UPDATE_PRIORITY_FULFILLED:
    case TASK_UPDATE_SCHEDULE_FULFILLED:
    case TASK_UPDATE_START_END_FULFILLED:
    case TASK_UPDATE_DEADLINE_FULFILLED:
    case TASK_UPDATE_ESTIMATE_FULFILLED:
    case TASK_UPDATE_PROGRESS_FULFILLED:
    case TASK_CUSTOM_FIELDS_FULFILLED:
    case TASK_DELETE_MESSAGE_FULFILLED:
      // no need, event processed in gd-session
      /*
      console.log('taskReducer', action.type);
      if (action.payload.id == state.task.id) {
        return {
          ...state,
          task: action.payload
        };
      }
      */
      return state;
    case TASK_UPDATE_STATUS_REJECTED:
    case TASK_UPDATE_PRIORITY_REJECTED:
    case TASK_UPDATE_SCHEDULE_REJECTED:
    case TASK_UPDATE_START_END_REJECTED:
    case TASK_UPDATE_DEADLINE_REJECTED:
    case TASK_UPDATE_ESTIMATE_REJECTED:
    case TASK_UPDATE_PROGRESS_REJECTED:
    case TASK_CUSTOM_FIELDS_REJECTED:
    case TASK_DELETE_MESSAGE_REJECTED:
      console.log('taskReducer', action.type, action.payload);
      return state;
    default:
      return state;
  }
}
