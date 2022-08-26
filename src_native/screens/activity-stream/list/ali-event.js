import React from 'react';
import { Grid, Row, Col, View, Item, Left, Body, Text } from 'native-base';
import Moment from 'moment';
import UserIcon from '../../../components/icon/user-icon';


export default class ActivityListEventBlock extends React.PureComponent {

  UNSAFE_componentWillUpdate() {
    this.previousUserId = null;
  }

  getMessageContent(eventUpdate) {
    const { CREATED, DATE_CHANGED, ACCOMPLISHED, NOT_ACCOMPLISHED, REASSIGNED } = gd.const.eventHistory;
    const { historyType, startDate, assignedToUserId } = eventUpdate;

    let result = null;
    switch(historyType) {
      case CREATED:
        result = (
          <View astm-message-1line>
            <Text astm-message-type>event created</Text>
          </View>
        );
        break;

      case DATE_CHANGED:
        result = (
          <View astm-message-1line>
            <Text astm-message-type>event date changed</Text>
            <Text astm-message-text numberOfLines={1}>{Moment(startDate).format("dddd, MMM D")}</Text>
          </View>
        );
        break;

      case ACCOMPLISHED:
        result = (
          <View astm-message-1line>
            <Text astm-message-type>event accomplished</Text>
          </View>
        );
        break;

      case REASSIGNED:
        const user = gd.session.users.get(assignedToUserId);
        result = (
          <View astm-message-1line>
            <Text astm-message-type>event reassigned to</Text>
            <Text astm-message-text numberOfLines={1}>{user.name}</Text>
          </View>
        );
        break;
    }
    return result;
  }


  renderMessage(key, notification) {
    const { userId } = notification;

    const user = gd.session.users.get(userId);
    const addItem = {};
    const addBody = {};
    if (this.previousUserId !== userId) {
      if (key > 0) addItem.style = { marginTop: 16 };
      addBody.style = { paddingTop: -3 };
    }

    const result = (
      <Row key={'event-update-'+key}>
        <Col>
          <Item activityStreamTaskMessage {...addItem}>
            <Left>
              {this.previousUserId !== userId && <UserIcon user={user}/>}
            </Left>
            <Body {...addBody}>
              {this.getMessageContent(notification.eventUpdate)}
            </Body>
          </Item>
        </Col>
      </Row>
    );

    this.previousUserId = userId;
    return result;
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