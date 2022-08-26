import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Grid, Row, ListItem, Body, Text } from 'native-base';
import TaskTypeIcon from '../../../components/icon/task-type-icon';
import EventIcon from '../../../components/icon/event-icon';
import { getGlyphByName } from '../../../common/icons';
import { getGlyphByType } from '../../../common/task-type-icons';
import ActivityListTaskBlock from './ali-task';
import ActivityListEventBlock from './ali-event';
import ActivityListProjectBlock from './ali-project';


export default function SectionListItem(props) {
  const { items, onProject, onTask, onEvent } = props;

  if (!items) {
    console.log('empty_items');
    return null;
  }

  return items.map((objectGroup, key) => {
    const { task, event, project, updates } = objectGroup;
    if (task)       return renderTask(key, task, updates, onTask);
    else if (event) return renderEvent(key, event, updates, onEvent);
    else            return renderProject(key, project, updates, onProject);
  });
}


function renderTask(key, task, updates, onPress) {
  const taskType = gd.session.taskTypes.get(task.taskTypeId);
  const glyph = String.fromCharCode(getGlyphByType(taskType.icon));
  //<TaskTypeIcon taskType={taskType} inList/>
  const onPressHandler = () => { onPress(task.id) };
  return (
    <ListItem activityStreamListItem key={'t-'+task.id+'-'+key} button={true} onPress={onPressHandler}>
      <Grid>
        <Row>
          <Body>
            <Text gd-icon asli-task-icon>{glyph}</Text>
            <Text asli-title numberOfLines={2}>{task.title}</Text>
          </Body>
        </Row>
        <Row>
          <ActivityListTaskBlock updates={updates} onPress={onPressHandler} />
        </Row>
      </Grid>
    </ListItem>
  )
}


function renderEvent(key, event, updates, onPress) {
  //const glyph = String.fromCharCode(getGlyphByName(gd.const.project.typeIcon[project.systemType]));
  const onPressHandler = () => { onPress(event.id) };
  return (
    <ListItem activityStreamListItem key={'e-'+event.id+'-'+key} button={true} onPress={onPressHandler}>
      <Grid>
        <Row>
          <Body>
            <EventIcon event={event}/>
            <Text asli-title numberOfLines={2}>{event.name}</Text>
          </Body>
        </Row>
        <Row>
          <ActivityListEventBlock updates={updates} onPress={onPressHandler}/>
        </Row>
      </Grid>
    </ListItem>
  )
}


function renderProject(key, project, updates, onPress) {
  const glyph = String.fromCharCode(getGlyphByName(gd.const.project.typeIcon[project.systemType]));
  const onPressHandler = () => { onPress(project.id) };
  return (
    <ListItem activityStreamListItem key={'p-'+project.id+'-'+key} button={true} onPress={onPressHandler}>
      <Grid>
        <Row>
          <Body>
            <Text gd-icon glisp-project-icon>{glyph}</Text>
            <Text asli-title numberOfLines={2}>{project.name}</Text>
          </Body>
        </Row>
        <Row>
          <ActivityListProjectBlock updates={updates} onPress={onPressHandler}/>
        </Row>
      </Grid>
    </ListItem>
  )
}