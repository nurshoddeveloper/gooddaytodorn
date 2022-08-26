import {
  PROJECT_TASKS_LOAD_PENDING,
  PROJECT_TASKS_LOAD_FULFILLED,
  PROJECT_TASKS_LOAD_REJECTED,
  PROJECT_TASKS_APPEND_NEW
} from '../constants';

const initialState = {
  project: null,
  subprojects: null,
  tasks: null,
  isFetching: false,
  error: false
};

export default function projectTasksReducer(state = initialState, action) {
  switch (action.type) {
    case PROJECT_TASKS_LOAD_PENDING:
      console.log('projectTasksReducer', action.type);
      return {
        ...initialState,
        isFetching: true
      };
    case PROJECT_TASKS_LOAD_FULFILLED:
      console.log('projectTasksReducer', action.type);
      return {
        ...state,
        isFetching: false,
        project: action.payload.project,
        subprojects: action.payload.subprojects || [],
        tasks: action.payload.tasks || [],
      };
    case PROJECT_TASKS_LOAD_REJECTED:
      console.log('projectTasksReducer', action.type);
      return {
        ...state,
        isFetching: false,
        error: true
      };
    case PROJECT_TASKS_APPEND_NEW:
      console.log('projectTasksReducer', action.type);
      const { project, tasks } = state;
      const newTask = action.data;

      if (!project || !tasks || project.id != newTask.projectId) return state;

      if (newTask.arUserId && !newTask.actionRequiredUserId) newTask.actionRequiredUserId = newTask.arUserId;

      if (newTask.taskTypeId && !newTask.statusId) {
        const taskType = gd.session.taskTypes.get(newTask.taskTypeId);
        if (taskType) {
          //console.log('taskType', taskType);
          const firstStatus = taskType.statuses.models[0];
          //console.log('firstStatus', firstStatus);
          if (firstStatus) {
            newTask.statusId = firstStatus.status.id;
          }
        }
      }

      tasks.push(newTask);

      return {
        ...state,
        tasks
      };


    default:
      return state;
  }
}