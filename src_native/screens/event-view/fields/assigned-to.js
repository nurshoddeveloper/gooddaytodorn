import React from 'react';
import {
  Body, Right,
  Button, Icon, Text,
  ListItem
} from 'native-base';


export default function fieldAssignedTo(props) {
  const { event, editable, openSelectAssignedUserScreen } = props;

  if (event.type != gd.const.event.type.PROJECT_MILESTONE && event.type != gd.const.event.type.PROJECT_DEADLINE) {
    return null;
  }

  const eventAssignedToUser = event.assignedToUser ? event.assignedToUser : gd.session.users.get(event.assignedToUserId);
  const username = eventAssignedToUser ? eventAssignedToUser.name : 'Select user';

  let a = {};
  if (editable) a = { button: true, onPress: openSelectAssignedUserScreen };

  return (
    <ListItem eventViewFieldItem {...a}>
      <Body>
        <Text note>Assigned to</Text>
        <Text>{username}</Text>
      </Body>
      <Right>
        {editable &&
          <Button gd-button-round-more onPress={openSelectAssignedUserScreen}>
            <Icon name="ios-more" />
          </Button>
        }
      </Right>
    </ListItem>
  );
}