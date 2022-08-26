import React from 'react';
import { Badge } from 'native-base';
import { getColorById } from '../../common/status-colors';

export default function taskStatusIcon(props) {
  const { status, tiny, small, normal, style } = props;
  if (!status) return null;

  const add = {};
  if (tiny) add['task-status-icon-tiny'] = true;
  else if (small) add['task-status-icon-small'] = true;
  else if (normal) add['task-status-icon-normal'] = true;
  else add['task-status-icon'] = true;
  add.style = style ? {...style} : {};

  const color = getColorById(status.color);
  add.style.backgroundColor = color;

  return <Badge {...add}></Badge>;

}