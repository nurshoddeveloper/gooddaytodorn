import React from 'react';
import { ListItem, Left, Body, Right, Text, View } from 'native-base';
import TaskTypeIcon from '../../../components/icon/task-type-icon';
import TaskStatusName from '../../../components/task-status-name';
import UserIcon from '../../../components/icon/user-icon';
import { getSafeTaskStatus } from '../../../common/utils';

export default function taskView(props) {
  const { item, onPress } = props;
  let userIcon = null;
  if (item.actionRequiredUserId) {
    const user = gd.session.users.get(item.actionRequiredUserId);
    if (user) {
      userIcon = <UserIcon user={user} />;
    }
  }

  const taskStatus = getSafeTaskStatus(item.taskTypeId, item.statusId);
  const taskType = gd.session.taskTypes.get(item.taskTypeId);

  return (
    <ListItem searchResultItem button={true} onPress={() => onPress(item.id)}>
      <Left>
        <TaskTypeIcon taskType={taskType} inList />
      </Left>
      <Body>
        <Text numberOfLines={2}>{item.title}</Text>
        <View sri-status style={{marginTop: 5, paddingLeft: 0}}>
          <TaskStatusName status={taskStatus} />
        </View>
      </Body>
      <Right>
        {userIcon}
      </Right>
    </ListItem>
  );
}
