import React from 'react';
import TaskViewProtoScreen from '../common/task-view-proto';
import { connect } from 'react-redux';
import TaskReply from './task-reply';
import {
  updateTaskArUser,
  replyTask,
  uploadAttachment
} from '../../redux/actions/task';

class TaskReplyScreen extends TaskViewProtoScreen {
  constructor(props) {
    super(props);
  }
  renderTask() {
    const { task: { task }, navigation, actions } = this.props;
    const message = this.props.navigation.getParam('message')
    return (
      <TaskReply
        task={task}
        navigation={navigation}
        actions={actions}
        message={message}
      />
    );
  }
}


function mapStateToProps(state) {
  return {
    task: state.task
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      updateTaskArUser: (task, arUserId) => dispatch(updateTaskArUser(task, arUserId)),
      replyTask: (task, values) => dispatch(replyTask(task, values)),
      uploadAttachment: (file) => dispatch(uploadAttachment(file))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskReplyScreen);
