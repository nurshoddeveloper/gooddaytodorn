import React from 'react';
import Moment from 'moment';
import { List, ListItem, Body, Right, Text, Badge } from 'native-base';

export default function myWorkFolders(props) {
  const { totals, onPress } = props;
  return (
    <List>
      <ListItem myWorkSection button={true} onPress={() => onPress('inbox')}>
        <Body>
          <Text bold>Inbox</Text>
        </Body>
        <Right>
          <Badge><Text numberOfLines={1}>{totals.inbox.length}</Text></Badge>
        </Right>
      </ListItem>
      {totals.pastdue && totals.pastdue.length > 0 &&
      <ListItem myWorkSection button={true} onPress={() => onPress('pastdue')}>
        <Body>
          <Text>Pastdue</Text>
        </Body>
        <Right>
          <Badge><Text numberOfLines={1}>{totals.pastdue.length}</Text></Badge>
        </Right>
      </ListItem>
      }
      <ListItem myWorkSection button={true} onPress={() => onPress('today')}>
        <Body>
          <Text bold>Today</Text>
        </Body>
        <Right>
          <Badge><Text numberOfLines={1}>{totals.today.length}</Text></Badge>
        </Right>
      </ListItem>
      {totals.scheduled.map((rec,key) => {
        const label = gd.utils.momentHumanize(Moment(rec.date),'ddd, MMM D');
        return (
          <ListItem key={key} myWorkSection button={true} onPress={() => onPress(rec.date)}>
            <Body>
              <Text>{label}</Text>
            </Body>
            <Right>
              <Badge><Text numberOfLines={1}>{rec.items.length}</Text></Badge>
            </Right>
          </ListItem>
        )
      })}
    </List>
  )
}