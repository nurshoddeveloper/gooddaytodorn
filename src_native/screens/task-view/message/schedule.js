import React from 'react';
import { ListItem, Body, Text } from 'native-base';

export default function messageSchedule(props) {
  const { message } = props;
  const { type, scheduleDate, fromUserId } = message;

  let toDate;
  if (type == gd.const.taskMessage.type.SCHEDULE_DATE) toDate = scheduleDate.format('ddd, MMM D');
  if (type == gd.const.taskMessage.type.SOMEDAY) toDate = 'Someday';

  return (
    <ListItem gd-list-item-task-message>
      <Body>
        <Text msg-system>{gd.session.users.get(fromUserId).name} scheduled the task to {toDate}</Text>
      </Body>
    </ListItem>
  );

}