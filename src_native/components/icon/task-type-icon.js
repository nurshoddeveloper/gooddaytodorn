import React from 'react';
import { Badge, Text } from 'native-base';
import { getGlyphByType } from '../../common/task-type-icons';

export default function taskTypeIcon(props) {
  const { taskType, selected, inHeader, inList, style } = props;
  if (!taskType) return null;

  const add = {};
  if (selected) add['task-type-icon-selected'] = true;
  if (inHeader) add['task-type-icon-in-header'] = true;
  if (inList) add['task-type-icon-in-list'] = true;
  if (style) add.style = {...style};

  const glyph = String.fromCharCode(getGlyphByType(taskType.icon));

  return <Badge task-type-icon {...add}><Text>{glyph}</Text></Badge>;

}
