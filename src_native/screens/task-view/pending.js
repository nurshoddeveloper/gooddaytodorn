import React from 'react';
import {
  Text,Item, Row
} from 'native-base';
import Moment from 'moment';
import { createNoArUser } from '../../common/utils';
import { AR_NO_ACTION_REQUIRED } from '../../common/constants';

export default function pending(props) {
  const { task } = props;

  if (!task.isOpen) return null;

  const arUser = gd.session.users.get(task.actionRequiredUserId) || createNoArUser();

  const msgs = task.messages.slice();
  msgs.reverse();

  let latestARChangeMessage = null;
  let isViewed = false;
  msgs.some(function (msg) {

    if (msg.type == gd.const.taskMessage.type.VIEW && msg.fromUserId == arUser.id) {
      isViewed = true;
    }

    if ([1, 3, 4, 5].indexOf(msg.communicationFlow) > -1) {
      latestARChangeMessage = msg;
      return true;
    }
  });

  //if (1) console.log("LATEST=", latestARChangeMessage);
  const secondsAgo = Moment.utc().diff(latestARChangeMessage.dateCreated, 'seconds');
  //if (1) console.log("SEC = ", secondsAgo);
  const duration = Moment.duration(secondsAgo, 'seconds');
  const showActionRequiredTime = arUser.id != AR_NO_ACTION_REQUIRED;

  let viewedIcon;
  if (task.users.length > 1) {
    // if (isViewed)
    //   viewedIcon = <div className="gd-icon-eye"></div>;
    // else
    //   viewedIcon = <div className="gd-icon-eye-disabled"></div>;
  }


  return (
    <Item task-view-pending>
      <Row style={{alignItems: 'center', height: 30}}>
        <Text style={{color: 'gray', fontSize: 14}}>Action is required by: </Text>
        <Text  style={{color: 'black', fontSize: 16, fontWeight: '500'}}>{arUser.name}</Text>
      </Row>
      {/* <Left>
        <UserIcon user={arUser} />
      </Left>
      <Body>
        <Grid>
          <Row>
            <Text>Action is required by:</Text>
          </Row>
          <Row>
            <Text username>{arUser.name}</Text>
            {showActionRequiredTime && <Text> ({duration.humanize()})</Text>}
          </Row>
        </Grid>
      </Body> */}
    </Item>
  );
}