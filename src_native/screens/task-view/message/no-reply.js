import React from 'react';
import { ListItem, Body, Text } from 'native-base';

export default function messageNoReply(props) {
  const { message } = props;

  const pendingTime =  message.getBackTime ? message.getBackTime.humanize() : null;

  return (
    <ListItem gd-list-item-task-message >
      <Body>
        <Text msg-system>Pending reply {pendingTime}</Text>
      </Body>
    </ListItem>
  );

}