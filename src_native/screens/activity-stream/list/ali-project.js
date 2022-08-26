import React from 'react';
import { Grid, Row, Col, View, Item, Left, Body, Text } from 'native-base';
import UserIcon from '../../../components/icon/user-icon';


export default class ActivityListProjectBlock extends React.PureComponent {

  UNSAFE_componentWillUpdate() {
    this.previousUserId = null;
  }

  getMessageContent(projectUpdate) {
    const { CREATED, STATUS_UPDATE, CLOSED } = gd.const.projectHistory;
    const { historyType, newStatusId, newSysStatus } = projectUpdate;

    let result = null;
    switch(historyType) {
      case CREATED:
        result = (
          <View astm-message-1line>
            <Text astm-message-type>project created</Text>
          </View>
        );
        break;

      case STATUS_UPDATE:
        const status = gd.session.statuses.get(newStatusId);
        result = (
          <View astm-message-1line>
            <Text astm-message-type>changed status</Text>
            <Text astm-message-text numberOfLines={1}>{status.name}</Text>
          </View>
        );
        break;

      case CLOSED:
        result = (
          <View astm-message-1line>
            <Text astm-message-type>project closed</Text>
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
      <Row key={'project-update-'+key}>
        <Col>
          <Item activityStreamTaskMessage {...addItem}>
            <Left>
              {this.previousUserId !== userId && <UserIcon user={user}/>}
            </Left>
            <Body {...addBody}>
              {this.getMessageContent(notification.projectUpdate)}
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