import React from 'react';
import { ListItem, Body, Text } from 'native-base';

export default function messageView(props) {
  const { message: { fromUserId } } = props;

  return (
    <ListItem gd-list-item-task-message>
      <Body>
        <Text msg-system>{gd.session.users.get(fromUserId).name} viewed the task</Text>
      </Body>
    </ListItem>
  );

}