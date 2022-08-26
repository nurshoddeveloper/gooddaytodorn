import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native'
import { ListItem, Body, Text, View, Row, Icon } from 'native-base';
import Hyperlink from 'react-native-hyperlink';
import _ from 'lodash';
import Attachments from './attachments';
import { getSafeTaskStatus } from '../../../common/utils';
import TaskStatusName from '../../../components/task-status-name';

export default function message(props) {
  const { task, message, navigation, onPressMore } = props;
  // console.log('message', message);

  let mainText = null;
  let changedStatus = null;

  let messageText = message.message;
  //If user changed status without message add default message
  if (message.taskStatusId && !messageText) {
    const taskStatus = getSafeTaskStatus(task.taskTypeId, message.taskStatusId);
    //changedStatus = <Text msg-system>{`Changed status to ${taskStatus.name}`}</Text>;
    changedStatus = <View task-message-texts-one-line><Text msg-system>Changed status to </Text><TaskStatusName status={taskStatus} /></View>;
  }
  if (!messageText) messageText = '';

  const isManager = gd.ac.check.company.isManager(task.companyId)
  const isMyMessage = message.fromUserId === gd.session.me.id
  const showDots = isManager || isMyMessage

  if (messageText.length > 0) {
    mainText = (
      <Row style={styles.row}>
        <View style={{ flex: 1 }}>
          <Hyperlink linkDefault={true} linkStyle={{ textDecorationLine: 'underline', flex: 1 }}>
            <Text style={styles.message}>{messageText}</Text>
          </Hyperlink>
        </View>
        {showDots && (
          <TouchableOpacity
            style={styles.btnDots}
            onPress={onPressMore}
          >
            <Icon name="ios-more" style={styles.dotsIcon} />
          </TouchableOpacity>
        )}
      </Row>
    );
  }

  // console.log('s1', messageText.split('\n'));
  // console.log('s2', messageText.split('\r'));

  let attachments = null;
  if (message.attachments) {
    console.log('attachments', message.attachments);
    attachments = <Attachments attachments={message.attachments} navigation={navigation} />
  }

  //task.createdOnBehalfByUserId = 'AczQKr'; //andrewId

  // created on behalf
  let createdOnBehalf = null;
  if (message.type == gd.const.taskMessage.type.FIRST && task.createdOnBehalfByUserId) {
    const user1 = gd.session.users.get(task.createdOnBehalfByUserId);
    const createdBy = user1 ? user1.name : 'unknown';
    const user2 = gd.session.users.get(task.createdByUserId);
    const behalfOf = user2 ? user2.name : 'unknown';
    createdOnBehalf = <Text msg-system>{`Created by ${createdBy} on behalf of ${behalfOf}`}</Text>;
  }

  // reported time
  let reportedTime = null;
  if (message.timeReportId) {
    const reportedMinutes = _.find(task.timeReports, r => r.id === message.timeReportId).reportedTime;
    let { hours, mins } = gd.utils.minutesToHM(reportedMinutes);
    if (mins < 10) mins = "0" + mins;

    reportedTime = <Text msg-system>{`Reported time ${hours}:${mins}`}</Text>;
  }

  return (
      <ListItem gd-list-item-task-message >
        <Body>
          {mainText}
          {changedStatus}
          {attachments}
          {reportedTime}
          {createdOnBehalf}
        </Body>
      </ListItem>
  );

}

const styles = StyleSheet.create({
  message: {
    color: '#030303',
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    paddingLeft: 16
  },
  btnDots: {
    padding: 8,
    top: -10
  },
  row: {
    justifyContent: 'space-between'
  },
  dotsIcon: {
    color: '#000000'
  }
})
