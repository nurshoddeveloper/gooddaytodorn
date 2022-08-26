import React from 'react';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import TaskTypeIcon from '../../components/icon/task-type-icon';
import ProjectIcon from '../../components/icon/project-icon';

export default function taskView(props) {
  const { item, onPress } = props;
  // onLayout={(e) => { console.log('layout', e.nativeEvent.layout)}}
  return (
    <ListItem searchResultItem button={true} onPress={() => onPress(item.id)}>
      <Left>
        <TaskTypeIcon taskType={item} inList />
      </Left>
      <Body>
        <Text numberOfLines={2}>{item.title}</Text>
        <Text numberOfLines={1} sri-project>{item.project.name}</Text>
      </Body>
      <Right>
        <ProjectIcon project={item.project} onlyWithPhoto />
      </Right>
    </ListItem>
  );
}
