import React from 'react';
import { ListItem, Body, Right, Text } from 'native-base';
import ProjectIcon from '../../components/icon/project-icon';

export default function eventView(props) {
  const { item, onPress } = props;
  const { event } = item;
  //console.log('eventView', event);

  const project = gd.session.projects.get(event.projectId);

  return (
    <ListItem myWorkFolderItem button={true} onPress={() => onPress(event.id)}>
      <Body>
        <Text numberOfLines={3}>{event.name}</Text>
      </Body>
      <Right>
        <ProjectIcon project={project} onlyWithPhoto />
      </Right>
    </ListItem>
  );
}