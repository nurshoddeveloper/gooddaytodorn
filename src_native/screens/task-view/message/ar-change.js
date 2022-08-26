import React from 'react';
import { ListItem, Body, Text } from 'native-base';

export default function messageArChange(props) {
  const { message } = props;

  if (message.toUserId) {
    let name = '';
    const user = gd.session.users.get(message.toUserId);
    if (user) name = user.name;

    return (
      <ListItem gd-list-item-task-message>
        <Body>
          <Text msg-system>Action required by {name}</Text>
        </Body>
      </ListItem>
    );

  } else {

    return (
      <ListItem gd-list-item-task-message>
        <Body>
          <Text msg-system>No action required</Text>
        </Body>
      </ListItem>
    );
  }

}