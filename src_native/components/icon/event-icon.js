import React from 'react';
import { Text } from 'native-base';
import { getGlyphByName } from '../../common/icons';


export default function eventIcon(props) {
  const { event, style } = props;
  if (!event) return null;

  const add = {};
  if (style) add.style = {...style};

  const iconClass = getIconClass(event);
  //console.log('iconClass', iconClass);
  const glyph = String.fromCharCode(getGlyphByName(iconClass));
  //console.log('glyph', glyph);

  return <Text gd-icon gd-event-icon {...add}>{glyph}</Text>;
}


function getIconClass(event) {
  const { PROJECT_EVENT, PROJECT_MILESTONE, PROJECT_DEADLINE, PROJECT_CREATED,
    COMPANY_EVENT, COMPANY_HOLIDAY,
    PERSONAL_PAID_VACATION, PERSONAL_NON_PAID_VACATION, PERSONAL_SICK_LEAVE, PERSONAL_TRAVEL,
    TASK_DEADLINE } = gd.const.event.type;
  const { type, task } = event;

  let result = '';

  switch (type) {
    case PROJECT_EVENT:                                     result = "gd-icon-event-project-event"; break;
    case PROJECT_MILESTONE:                                 result = "gd-icon-event-project-milestone"; break;
    case PROJECT_DEADLINE:                                  result = "gd-icon-event-project-deadline"; break;
    case PROJECT_CREATED:                                   result = "gd-icon-event-project-created"; break;

    case COMPANY_EVENT:                                     result = "gd-icon-event-company-event"; break;
    case COMPANY_HOLIDAY:                                   result = "gd-icon-event-company-holiday"; break;

    case PERSONAL_PAID_VACATION:                            result = "gd-icon-event-personal-vacation"; break;
    case PERSONAL_NON_PAID_VACATION:                        result = "gd-icon-event-personal-vacation"; break;
    case PERSONAL_SICK_LEAVE:                               result = "gd-icon-event-personal-sick-leave"; break;
    case PERSONAL_TRAVEL:                                   result = "gd-icon-event-personal-travel"; break;

    case TASK_DEADLINE:
      if (task) {
        const taskType = gd.session.taskTypes.get(task.taskTypeId);
        if (taskType) {
          const icon = gd.const.task.icon[taskType.icon];
          result = icon;
        }
      }

      break;
  }

  return result;
}