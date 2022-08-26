import React from 'react';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import { getGlyphByName } from '../../../common/icons';

export default function projectView(props) {
  const { item, onPress } = props;

  const name = gd.const.project.typeIcon[item.systemType];
  const glyph = String.fromCharCode(getGlyphByName(name));

  return (
    <ListItem searchResultItem button={true} onPress={() => onPress(item.id)}>
      <Left>
        <Text gd-icon>{glyph}</Text>
      </Left>
      <Body>
        <Text numberOfLines={3} style={{fontWeight:'500'}}>{item.name}</Text>
      </Body>
      <Right>
      </Right>
    </ListItem>
  );
}
