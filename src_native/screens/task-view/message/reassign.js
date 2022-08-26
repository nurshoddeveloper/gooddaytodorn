import React from 'react';
import { ListItem, Body, Text } from 'native-base';

export default function messageReassign(props) {
  const { message } = props;

  let name = '';
  const user = gd.session.users.get(message.toUserId);
  if (user) name = user.name;

  return (
    <ListItem gd-list-item-task-message>
      <Body>
        <Text msg-system>Reassigned to {name}</Text>
      </Body>
    </ListItem>
  );

}