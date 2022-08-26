import React from 'react';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import EventIcon from '../../../components/icon/event-icon';
import ProjectIcon from '../../../components/icon/project-icon';
import UserIcon from '../../../components/icon/user-icon';

export default function eventItem(props) {
  const { item, onPress } = props;
  const { event } = item;
  //console.log('eventItem', event);

  //date
  let start, delimeter, end;
  start = event.startDate ? event.startDate.format('MMM D') : 'Start date';
  if (event.endDate) {
    delimeter = ' - ';
    end = event.endDate.format('MMM D');
  } else if (event.type === gd.const.event.type.PROJECT_EVENT) {
    delimeter = ' - ';
    end = event.endDate ? event.endDate.format('MMM D') : 'End date';
  }

  //project
  const project = gd.session.projects.get(event.projectId);

  //user
  let user;
  if (event.assignedToUserId) user = gd.session.users.get(event.assignedToUserId);
  else if (event.userId) user = gd.session.users.get(event.userId);

  return (
    <ListItem searchResultItem button={true} onPress={() => onPress(event.id)}>
      <Left>
        <EventIcon event={event} />
      </Left>
      <Body>
        <Text numberOfLines={1}>{event.name}</Text>
        <Text numberOfLines={1} style={{marginTop:10, fontSize: 12}}>{start}{delimeter}{end}</Text>
      </Body>
      <Right>
        {project && <ProjectIcon project={project} />}
        {user && <UserIcon user={user} style={{marginLeft: 15}} />}
      </Right>
    </ListItem>
  );
}