import React from 'react';
import { ListItem, Body, Text } from 'native-base';

export default function messagePriority(props) {
  const { task, message } = props;

  const priorityName = gd.session.companies.get(task.companyId).priorities.getName(parseInt(message.message),true);

  return (
    <ListItem gd-list-item-task-message>
      <Body>
        <Text msg-system>Changed priority to {priorityName}</Text>
      </Body>
    </ListItem>
  );

}