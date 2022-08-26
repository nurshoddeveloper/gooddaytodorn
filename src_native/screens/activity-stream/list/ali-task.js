import React from 'react';
import { Grid, Row, Col, View, Item, Left, Body, Text } from 'native-base';
import UserIcon from '../../../components/icon/user-icon';
import TaskStatusName from '../../../components/task-status-name';


export default class ActivityListTaskBlock extends React.PureComponent {

  UNSAFE_componentWillUpdate() {
    this.previousUserId = null;
  }

  processTextMessage(messageText) {
    if (!messageText) messageText = '';
    // messageText = markdownToPlain(messageText);
    //
    // this.htmlEntities = new HTMLEntities();
    // messageText = this.htmlEntities.decode(messageText);


    return (
      <View astm-message-2lines>
        <Text astm-message-type>task message</Text>
        <Text astm-message-text numberOfLines={3}>{messageText}</Text>
      </View>
    );
  }

  renderReply(notification) {
    const { REASSIGN } = gd.const.taskMessage.type;
    const { taskMessage } = notification;
    const { type } = taskMessage;
    let message = null;

    if (type < REASSIGN) {
      if (taskMessage.message ) {
        message = this.processTextMessage(taskMessage.message);
      }
    }

    return message;
  }

  renderStatus(notification) {
    const { FIRST } = gd.const.taskMessage.type;
    const { communicationFlow, taskStatusId } = notification.taskMessage;
    let newStatus;

    if (taskStatusId) {
      newStatus = (
        <View astm-message-1line>
          <Text astm-message-type>changed status</Text>
          <TaskStatusName status={gd.session.statuses.get(taskStatusId)} />
        </View>
      );
    } else {
      if (communicationFlow === FIRST) {
        newStatus = (
          <View astm-message-1line>
            <Text astm-message-type>task created</Text>
          </View>
        );
      }
    }

    return newStatus;
  }

  renderAR(notification) {
    const { communicationFlow, toUserId } = notification.taskMessage;
    const { COMMENT, GET_BACK, SWITCH, INTERRUPT } = gd.const.communicationFlow;
    let actionRequiredUser;

    if ([COMMENT, GET_BACK, SWITCH, INTERRUPT].includes(communicationFlow)
      && toUserId) {
      const user = gd.session.users.get(toUserId);
      actionRequiredUser = (
        <View astm-message-1line>
            <Text astm-message-type>changed AR user to</Text>
            <Text astm-message-text numberOfLines={1}>{user.name}</Text>
        </View>
      );
    }

    return actionRequiredUser;
  }

  renderMessage(key, notification) {
    const { userId } = notification;

    const renderTaskMessage = (numKey, key, component) => {
      if (!component) return null;

      const user = gd.session.users.get(userId);
      const addItem = {};
      const addBody = {};
      if (this.previousUserId !== userId) {
        if (numKey > 0) addItem.style = { marginTop: 16 };
        addBody.style = { paddingTop: -3 };
      }

      const result = (
        <Row key={key}>
          <Col>
            <Item activityStreamTaskMessage {...addItem}>
              <Left>
                {this.previousUserId !== userId && <UserIcon user={user}/>}
              </Left>
              <Body {...addBody}>
                {component}
              </Body>
            </Item>
          </Col>
        </Row>
      );

      this.previousUserId = userId;
      return result;
    };


    return [
      renderTaskMessage(key, key + '_reply',     this.renderReply(notification)),
      renderTaskMessage(key, key + '_status',    this.renderStatus(notification)),
      renderTaskMessage(key, key + '_ar',        this.renderAR(notification))
    ]
  }

  render() {
    const { updates } = this.props;

    return (
      <Grid>
        {
          updates.map((update, key) => this.renderMessage(key, update))
        }
      </Grid>
    )
  }

}