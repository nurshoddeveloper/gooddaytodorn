import React from 'react';
import TaskViewProtoScreen from '../common/task-view-proto';
import { connect } from 'react-redux';
import TaskView from './task-view';
import {
  loadTask,
  updateTaskStatus,
  updateTaskPriority,
  updateTaskSchedule,
  updateTaskStartEnd,
  updateTaskDeadline,
  updateTaskEstimate,
  updateTaskProgress,
  updateCustomFields,
  deleteTaskMessage,
  updateTaskMessage,
  changeTaskName,
  deleteTask,
  updateTaskArUser
} from '../../redux/actions/task';


class TaskViewScreen extends TaskViewProtoScreen {
  constructor(props) {
    super(props);
  }
  renderTask() {
    const { task: { task }, me, navigation, actions } = this.props;
    return <TaskView me={me} task={task} navigation={navigation} actions={actions} />;
  }
}


function mapStateToProps(state) {
  return {
    me: state.me,
    task: state.task
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadTask: (taskId) => dispatch(loadTask(taskId)),
      updateTaskStatus: (task, newStatusId) => dispatch(updateTaskStatus(task, newStatusId)),
      updateTaskPriority: (task, newPriority) => dispatch(updateTaskPriority(task, newPriority)),
      updateTaskSchedule: (task, schedule) => dispatch(updateTaskSchedule(task, schedule)),
      updateTaskStartEnd: (task, start, end) => dispatch(updateTaskStartEnd(task, start, end)),
      updateTaskDeadline: (task, deadline) => dispatch(updateTaskDeadline(task, deadline)),
      updateTaskEstimate: (task, estimate) => dispatch(updateTaskEstimate(task, estimate)),
      updateTaskProgress: (task, progress) => dispatch(updateTaskProgress(task, progress)),
      deleteTaskMessage: (task, messageID) => dispatch(deleteTaskMessage(task, messageID)),
      updateTaskMessage: (task, message, text) => dispatch(updateTaskMessage(task, message, text)),
      changeTaskName: (task, text) => dispatch(changeTaskName(task, text)),
      deleteTask: (task) => dispatch(deleteTask(task)),
      updateTaskArUser: (task, arUserId) => dispatch(updateTaskArUser(task, arUserId)),
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskViewScreen);
