import React from 'react';
import { Dimensions, PixelRatio, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Item, Text,
  Grid, Row, Col, View,
  ListItem, Left, Body, Right
} from 'native-base';
import Moment from 'moment';
import theme from '../../../app-theme/variables/platform';
import TaskStatusIcon from '../../../components/icon/task-status-icon';
import TaskStatusName from '../../../components/task-status-name';
import TaskPriorityIcon from '../../../components/icon/task-priority-icon';
import ProgressBar from '../../../components/progress-bar';
import { getSafeTaskStatus } from '../../../common/utils';
import { getGlyphByName } from '../../../common/icons';



export default function TaskControlsHeader(props) {
  const { task, actions, onLayout } = props;

  const taskStatus = getSafeTaskStatus(task.taskTypeId, task.statusId);

  let scheduleName = '-';
  const scheduleAdd = {};
  const showSchedule = task.isOpen && (task.actionRequiredUserId && task.actionRequiredUserId == gd.session.me.id);
  if (showSchedule) {
    if (task.scheduleStatus == gd.const.task.scheduleStatus.SOMEDAY) {
      scheduleName = 'Someday';
    }

    if (task.scheduleStatus == gd.const.task.scheduleStatus.SCHEDULED) {
      scheduleName = gd.utils.momentHumanize(task.scheduleDate, 'MMM, DD');
      if (task.scheduleDate && task.scheduleDate.isBefore(Moment(),'days')) {
        scheduleAdd['gd-schedule-past'] = true;
      }
    }
  }


  const glyphMore = String.fromCharCode(getGlyphByName('more'));

  return (
    <Grid onLayout={onLayout}>
      <Row style={styleControlsMain}>
        <Col size={1}>
          <Item task-control-item onPress={task.isOpen ? actions.openSelectStatusScreen : actions.openReplyScreen}>
            <Text header>Status</Text>
            <View tci-status>
              <TaskStatusName status={taskStatus}/>
            </View>
          </Item>
        </Col>
        {showSchedule &&
        <Col size={1} style={styleColSchedule}>
          <Item task-control-item onPress={actions.openSelectScheduleScreen}>
            <Text header>Schedule</Text>
            <View tci-schedule>
              <Text numberOfLines={1} {...scheduleAdd}>{scheduleName}</Text>
            </View>
          </Item>
        </Col>
        }
        <Col style={styleColMore}>
          <TouchableOpacity style={styleColMoreTO} onPress={actions.handleMore}>
            <Text gd-icon style={{fontSize: 18, color: theme.textGrayColor}}>{glyphMore}</Text>
          </TouchableOpacity>
        </Col>
      </Row>
    </Grid>
  )
}


const styleControlsMain = {
  borderBottomWidth: theme.borderWidth,
  borderColor: theme.cardBorderColor,
  backgroundColor: theme.taskViewControlsBg,
  //backgroundColor: 'blue',
  //opacity: 1,
};

const styleColSchedule = {
  borderLeftWidth: theme.borderWidth,
  borderColor: theme.cardBorderColor
};

const styleColMore = {
  width: 50,
  borderLeftWidth: theme.borderWidth, //StyleSheet.hairlineWidth,
  borderColor: theme.cardBorderColor,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
};

const styleColMoreTO = {
  flex: 1,
  width: 50,
  alignItems: 'center',
  justifyContent: 'center',
  //flexDirection: 'column',
  //borderWidth: 1,
  //borderColor: 'red',
};
