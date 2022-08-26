import React from 'react';
import { ListItem, Body, Text } from 'native-base';

export default function messageMove(props) {
  const { message } = props;

  return (
    <ListItem gd-list-item-task-message>
      <Body>
        <Text msg-system>{message.message}</Text>
      </Body>
    </ListItem>
  );

}