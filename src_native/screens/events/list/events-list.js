import React from 'react';
import { List } from 'native-base';
import Event from './event';

export default function eventsList(props) {
  const { items, onPress } = props;
  if (!items || items.length < 1) return null;

  return (
    <List>
      {items.map(de => {
        return (
          <Event key={de.id} item={{event: de.eventObject}} onPress={onPress}/>
        )
      })}
    </List>
  )
}
