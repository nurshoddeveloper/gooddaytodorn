import React from 'react';
import { Dimensions, PixelRatio } from 'react-native';
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


export default function TaskControlsFields(props) {
  const { task, actions } = props;
  console.log(props, 'hello taskcontrolfields')

  const priorityName = gd.session.companies.get(task.companyId).priorities['priority' + task.priority];

  let progressText = '-';
  let showProgress = false;
  let progressBarWidth = 0;
  if (task.progress > 0 || task.progress === 0) {
    progressText = task.progress + '%';
    showProgress = true;
    const ww = Dimensions.get('window').width;
    //console.log('ww', ww);
    progressBarWidth = ww - 230;
    if (progressBarWidth < 30) progressBarWidth = 30;
  }

  let startDateText = '';
  let endDateText = '';
  if (task.startDate) startDateText = gd.utils.momentHumanize(task.startDate, 'MMM, DD');
  if (task.endDate) endDateText = gd.utils.momentHumanize(task.endDate, 'MMM, DD');
  const haveStartEnd = startDateText != '' && endDateText != '';

  let deadlineText = '-';
  const deadlineAdd = {};
  if (task.deadline) {
    deadlineText = gd.utils.momentHumanize(task.deadline, 'MMM, DD');
    if (task.deadline.isBefore(Moment(), 'days')) {
      deadlineAdd['gd-schedule-past'] = true;
    }
  }

  let estimateText = '-';
  if (task.estimate) {
    estimateText = gd.utils.minutesHumanize(task.estimate);
  }

  const glyphMore = String.fromCharCode(getGlyphByName('more'));


  return (
    <View style={styleControlsExpanded}>
      {task.isOpen &&
        <ListItem taskExtraFieldItem button={true} onPress={actions.openSelectPriorityScreen}>
          <Left>
            <Text>PRIORITY</Text>
          </Left>
          <Body>
            <TaskPriorityIcon priority={task.priority} tiny />
            <Text numberOfLines={1}>{priorityName}</Text>
          </Body>
          <Right>
            <View tefi-more-circle>
              <Text gd-icon>{glyphMore}</Text>
            </View>
          </Right>
        </ListItem>
      }
      <ListItem taskExtraFieldItem button={true} onPress={actions.openSelectProgressScreen}>
        <Left>
          <Text>PROGRESS</Text>
        </Left>
        <Body>
          {showProgress &&
            <ProgressBar width={progressBarWidth} progress={task.progress} style={{ alignSelf: 'center', marginRight: 8 }} />
          }
          <Text numberOfLines={1}>{progressText}</Text>
        </Body>
        <Right>
          <View tefi-more-circle>
            <Text gd-icon>{glyphMore}</Text>
          </View>
        </Right>
      </ListItem>
      <ListItem taskExtraFieldItem button={true} onPress={actions.openSelectDeadlineScreen}>
        <Left>
          <Text>DEADLINE</Text>
        </Left>
        <Body>
          <Text numberOfLines={1} {...deadlineAdd}>{deadlineText}</Text>
        </Body>
        <Right>
          <View tefi-more-circle>
            <Text gd-icon>{glyphMore}</Text>
          </View>
        </Right>
      </ListItem>
      <ListItem taskExtraFieldItem button={true} onPress={actions.openSelectStartDateScreen}>
        <Left>
          <Text>START - END</Text>
        </Left>
        {haveStartEnd
          ?
          <Body tefi-start-end-dates>
            <Text numberOfLines={1}>{startDateText}</Text>
            <Text numberOfLines={1}> - </Text>
            <Text numberOfLines={1} onPress={actions.openSelectEndDateScreen}>{endDateText}</Text>
          </Body>
          :
          <Body tefi-start-end-dates>
            <Text numberOfLines={1}>-</Text>
          </Body>
        }
        <Right>
          <View tefi-more-circle>
            <Text gd-icon>{glyphMore}</Text>
          </View>
        </Right>
      </ListItem>
      <ListItem taskExtraFieldItem taskExtraFieldItem-last button={true} onPress={actions.openSelectEstimateScreen}>
        <Left>
          <Text>ESTIMATE</Text>
        </Left>
        <Body>
          <Text numberOfLines={1}>{estimateText}</Text>
        </Body>
        <Right>
          <View tefi-more-circle>
            <Text gd-icon>{glyphMore}</Text>
          </View>
        </Right>
      </ListItem>
    </View>
  );
}

const styleControlsExpanded = {
  borderBottomWidth: theme.borderWidth,
  borderColor: theme.cardBorderColor,
  backgroundColor: theme.taskViewControlsExpandedBg,
  //borderWidth: 1,
  //borderColor: 'cyan',
};
