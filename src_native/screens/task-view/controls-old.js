import React from 'react';
import {
  Text,
  Item,
  Row, Col, View
} from 'native-base';
import Moment from 'moment';
import theme from '../../app-theme/variables/platform';
import TaskStatusIcon from '../../components/icon/task-status-icon';
import TaskPriorityIcon from '../../components/icon/task-priority-icon';
import { getSafeTaskStatus } from '../../common/utils';

export default function taskControls(props) {
  const { task } = props;
  return task.isOpen ? <TaskOpen {...props} /> : <TaskClosed {...props} />;
}

function TaskOpen(props) {
  const { task, actions, onLayout } = props;
  const taskStatus = getSafeTaskStatus(task.taskTypeId, task.taskStatusId);
  const priorityName = gd.session.companies.get(task.companyId).priorities['priority'+task.priority];

  let scheduleName = '-';
  if (task.scheduleStatus == gd.const.task.scheduleStatus.SOMEDAY) {
    scheduleName = 'Someday';
  }
  const scheduleAdd = {};
  if (task.scheduleStatus == gd.const.task.scheduleStatus.SCHEDULED) {
    scheduleName = gd.utils.momentHumanize(task.scheduleDate,'MMM, DD');
    if (task.scheduleDate && task.scheduleDate.isBefore(Moment(),'days')) {
      scheduleAdd['gd-schedule-past'] = true;
    }
  }

  return (
    <Row style={styleStatusRow} onLayout={onLayout}>
      <Col size={1}>
        <Item task-control-item onPress={actions.openSelectStatusScreen}>
          <Text header>Status</Text>
          <View tci-status>
            <TaskStatusIcon status={taskStatus} tiny />
            <Text numberOfLines={1}>{taskStatus.name}</Text>
          </View>
        </Item>
      </Col>
      <Col size={1} style={styleColCenter}>
        <Item task-control-item center onPress={actions.openSelectPriorityScreen}>
          <Text header>Priority</Text>
          <View tci-priority>
            <TaskPriorityIcon priority={task.priority} tiny />
            <Text numberOfLines={1}>{priorityName}</Text>
          </View>
        </Item>
      </Col>
      <Col size={1}>
        <Item task-control-item onPress={actions.openSelectDateScreen}>
          <Text header>Schedule</Text>
          <View tci-schedule>
            <Text numberOfLines={1} {...scheduleAdd}>{scheduleName}</Text>
          </View>
        </Item>
      </Col>
    </Row>
  )
}


function TaskClosed(props) {
  const { task, actions, onLayout } = props;
  const taskStatus = getSafeTaskStatus(task.taskTypeId, task.taskStatusId);

  return (
    <Row style={styleStatusRow} onLayout={onLayout}>
      <Col>
        <Item task-control-item onPress={actions.openReplyScreen}>
          <Text header>Status</Text>
          <View tci-status>
            <TaskStatusIcon status={taskStatus} tiny />
            <Text numberOfLines={1}>{taskStatus.name}</Text>
          </View>
        </Item>
      </Col>
    </Row>
  )
}

const styleStatusRow = {
  borderBottomWidth: theme.borderWidth,
  borderColor: theme.cardBorderColor,
  backgroundColor: '#fafafa',
};

const styleColCenter = {
  borderLeftWidth: theme.borderWidth,
  borderRightWidth: theme.borderWidth,
  borderColor: theme.cardBorderColor
};
