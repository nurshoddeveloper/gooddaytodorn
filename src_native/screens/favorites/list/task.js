import React from 'react';
import { ListItem, Left, Body, Right, View, Text } from 'native-base';
import TaskStatusIcon from '../../../components/icon/task-status-icon';
import UserIcon from '../../../components/icon/user-icon';
import { getSafeTaskStatus } from '../../../common/utils';
import { getGlyphByName } from '../../../common/icons';

export default function taskView(props) {
  const { item, onPress } = props;
  console.log('taskView item', item);
  const glyph = String.fromCharCode(getGlyphByName(item.pin ? 'pin' : 'star'));
  const glyphAdd = item.pin ? {style:{marginTop:2}} : {};
  const taskStatus = getSafeTaskStatus(item.taskTypeId, item.statusId);
  const user = gd.session.users.get(item.actionRequiredUserId);
  return (
    <ListItem searchResultItem button={true} onPress={() => onPress(item.id)}>
      <Left>
        <Text gd-icon {...glyphAdd}>{glyph}</Text>
      </Left>
      <Body>
        <Text numberOfLines={2}>{item.title}</Text>
        {false && taskStatus.name !== 'unknown' &&
        <View tci-status style={{marginTop: 5, paddingLeft: 0}}>
          <TaskStatusIcon status={taskStatus} tiny style={{marginRight: 8}}/>
          <Text numberOfLines={1}>{taskStatus.name}</Text>
        </View>
        }
      </Body>
      <Right>
        {user && <UserIcon user={user} />}
      </Right>
    </ListItem>
  );
}
