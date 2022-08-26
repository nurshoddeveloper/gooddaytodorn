import React from 'react';
import { ListItem, Left, Body, Right, View, Text } from 'native-base';
import { getGlyphByName } from '../../../common/icons';
import { getSafeProjectStatus } from '../../../common/utils';
import TaskStatusIcon from '../../../components/icon/task-status-icon';

export default function projectView(props) {
  const { item, onPress } = props;

  //const name = gd.const.project.typeIcon[item.systemType];
  //const glyph = String.fromCharCode(getGlyphByName(name));
  const glyph = String.fromCharCode(getGlyphByName(item.pin ? 'pin' : 'star'));
  const glyphAdd = item.pin ? {style:{marginTop:2}} : {};

  //console.log('item', item);

  // add missing systemStatus field
  if (!item.systemStatus) {
    const p2 = gd.session.projects.get(item.id);
    //console.log('p2', p2);
    if (p2) {
      item.systemStatus = p2.systemStatus;
    }
  }

  let projectStatus = getSafeProjectStatus(item);


  return (
    <ListItem searchResultItem button={true} onPress={() => onPress(item.id)}>
      <Left>
        <Text gd-icon {...glyphAdd}>{glyph}</Text>
      </Left>
      <Body>
        <Text numberOfLines={2}>{item.name}</Text>
        {false && projectStatus.name !== 'unknown' &&
        <View tci-status style={{marginTop: 5, paddingLeft: 0}}>
          <TaskStatusIcon status={projectStatus} tiny style={{marginRight: 8}}/>
          <Text numberOfLines={1}>{projectStatus.name}</Text>
        </View>
        }
      </Body>
      <Right>

      </Right>
    </ListItem>
  );
}
