import React from 'react';
import { Text } from 'native-base';
import { getColorById } from '../common/status-colors';


export default function taskStatusName(props) {
  const { status } = props;
  if (!status) return null;
  const style = {
    color: getColorById(status.color),
  };

  return <Text task-status-name style={style} numberOfLines={1}>{status.name.toUpperCase()}</Text>;
}