import React from 'react';
import { Badge } from 'native-base';

export default function taskPriorityIcon(props) {
  const { priority, tiny, style } = props;
  if (!priority) return null;

  const add = {};
  if (tiny) add['task-priority-icon-tiny'] = true;
  else add['task-priority-icon'] = true;
  if (style) add.style = {...style};

  const color = '#' + gd.const.priority.colors[priority];

  switch (priority) {
    case gd.const.priority.levels.emergency:
      //res = <div className="gd-icon-emergency"></div>;
      add['tpi-emergency'] = true;
      break;
    case gd.const.priority.levels.blocker:
      //res = <div className="gd-icon-flag"></div>;
      add['tpi-blocker'] = true;
      break;
    default:
      //res = <div className="p-ico" style={{backgroundColor: getIconColor(value)}}></div>;
      add.style = add.style || {};
      add.style.backgroundColor = color;
      break;
  }

  return <Badge {...add}></Badge>;

}
