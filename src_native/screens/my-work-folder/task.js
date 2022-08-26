import React from 'react';
import { ListItem, Body, Right, Text } from 'native-base';
import UserIcon from '../../components/icon/user-icon';
import ProjectIcon from '../../components/icon/project-icon';

export default function taskView(props) {
  const { item, onPress } = props;
  // onLayout={(e) => { console.log('layout', e.nativeEvent.layout)}}
  return (
    <ListItem myWorkFolderItem button={true} onPress={() => onPress(item.task.id)}>
      <Body>
        <Text numberOfLines={2}>{item.task.title}</Text>
        <Text numberOfLines={1} mwfi-project>{item.project.name}</Text>
      </Body>
      <Right>
        <ProjectIcon project={item.project} onlyWithPhoto />
        <UserIcon user={item.fromUser} style={{marginLeft: 15}} />
      </Right>
    </ListItem>
  );
}
