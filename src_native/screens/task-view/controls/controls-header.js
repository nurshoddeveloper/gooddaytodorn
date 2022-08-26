import React from 'react';
import {
  Item, Text,
  Grid, Row, Col, View,
  Icon
} from 'native-base';
import { Platform } from 'react-native';
import Moment from 'moment';
import theme from '../../../app-theme/variables/platform';
import { getSafeTaskStatus } from '../../../common/utils';
import { getColorById } from '../../../common/status-colors';

export default function TaskControlsHeader(props) {
  const { task, actions, onLayout, status } = props;

  const taskStatus = getSafeTaskStatus(task.taskTypeId, task.statusId);
  const color = getColorById(taskStatus.color)
  let scheduleName = '-';
  const scheduleAdd = {};
  const showSchedule = task.isOpen && (task.actionRequiredUserId && task.actionRequiredUserId == gd.session.me.id);
  if (showSchedule) {
    if (task.scheduleStatus == gd.const.task.scheduleStatus.SOMEDAY) {
      scheduleName = 'Someday';
    }

    if (task.scheduleStatus == gd.const.task.scheduleStatus.SCHEDULED) {
      scheduleName = gd.utils.momentHumanize(task.scheduleDate, 'MMM, DD');
      if (task.scheduleDate && task.scheduleDate.isBefore(Moment(), 'days')) {
        scheduleAdd['gd-schedule-past'] = true;
      }
    }
  }


  // const glyphMore = String.fromCharCode(getGlyphByName('more'));

  return (
    <Grid onLayout={onLayout}>
      <Row style={styleControlsMain}>
        <Col size={1} style={[styleColSchedule, (status.showMessageScreen) ? { backgroundColor: 'white', borderBottomWidth: 0 } : {}]}>
          <Item onPress={actions.showMessageScreen} style={{ alignItems: 'center', flex: 1, justifyContent: 'center', padding: 12 }}>
            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              <Icon name='chat' type='Entypo' style={{ fontSize: 20, color: "#565656" }} />
              <Text style={[{ color: 'gray', fontSize: 10 }, (Platform.OS === 'android') ? { fontSize: 8 } : {}]}>Messages</Text>
            </View>
          </Item>
        </Col>
        <Col size={1} style={[styleColSchedule, (status.showTaskInfoScreen) ? { backgroundColor: 'white', borderBottomWidth: 0 } : {}]}>
          <Item onPress={actions.openTaskInfoScreen} style={{ alignItems: 'center', flex: 1, justifyContent: 'center', padding: 12 }}>
            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              <Icon name='info-with-circle' type='Entypo' style={{ fontSize: 20, color: "#565656" }} />
              <Text style={[{ color: 'gray', fontSize: 10 }, (Platform.OS === 'android') ? { fontSize: 8 } : {}]}>Task Info</Text>
            </View>
          </Item>
        </Col>

        <Col size={1.2} style={[styleColSchedule, (status.showTimeReportScreen) ? { backgroundColor: 'white', borderBottomWidth: 0 } : {}]}>
          <Item onPress={actions.openTimeReportScreen} style={{ alignItems: 'center', flex: 1, justifyContent: 'center', padding: 4 }}>
            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              <Icon name='access-time' type='MaterialIcons' style={{ fontSize: 20, color: "#565656" }} />
              <Text style={[{ color: 'gray', fontSize: 10 }, (Platform.OS === 'android') ? { fontSize: 8 } : {}]}>Time Reports</Text>
            </View>
          </Item>
        </Col>

        <Col size={1.8} style={styleColSchedule}>
          <Item onPress={task.isOpen ? actions.openSelectStatusScreen : actions.openReplyScreen} style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: color, fontSize: 13, fontWeight: "bold", textAlign: "center" }}>{taskStatus.name.toUpperCase()}</Text>
            </View>
          </Item>
        </Col>
      </Row>
    </Grid>
  )
}


const styleControlsMain = {
  borderBottomWidth: 0,
  borderColor: theme.cardBorderColor,
  backgroundColor: theme.taskViewControlsBg,
  //backgroundColor: 'blue',
  //opacity: 1,
};

const styleColSchedule = {
  borderLeftWidth: 0.4,
  borderBottomWidth: 0.4,
  borderColor: theme.cardBorderColor,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
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
