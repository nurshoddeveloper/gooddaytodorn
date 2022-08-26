import React from 'react';
import {
  Body, Right,
  Button, Icon, Text, Badge,
  ListItem
} from 'native-base';
import { getColorById } from '../../../common/status-colors';

const options = [
  {
    value: 'pending',
    label: 'Pending',
    color: 2,
    systemStatus: 1
  },
  {
    value: 'accomplished',
    label: 'Accomplished',
    color: 11,
    systemStatus: 5
  },
];


export default function fieldStatus(props) {
  const { event, editable, openSelectStatusScreen } = props;

  if (event.type != gd.const.event.type.PROJECT_MILESTONE && event.type != gd.const.event.type.PROJECT_DEADLINE) {
    return null;
  }

  const statusName = (event.isAccomplished) ? 'Accomplished' : 'Pending';
  const color = (event.isAccomplished) ? 11 : 2;
  const bgColor = getColorById(color);

  let a = {};
  if (editable) a = { button: true, onPress: openSelectStatusScreen };

  return (
    <ListItem eventViewFieldItem {...a}>
      <Body>
        <Text note>Status</Text>
        <Badge event-status style={{marginTop: 3, backgroundColor: bgColor}}>
          <Text>{statusName}</Text>
        </Badge>
      </Body>
      <Right style={{paddingTop:20}}>
        {editable &&
          <Button gd-button-round-more onPress={openSelectStatusScreen}>
            <Icon name="ios-more" />
          </Button>
        }
      </Right>
    </ListItem>
  );
}