import React from 'react';
import { View } from 'native-base';
import Attachment from './attachment';


export default function attachments(props) {
  const { attachments, navigation } = props;
  return (
    <View gd-task-attachments>
      {attachments.map((attachment,key) => <Attachment key={key} attachment={attachment} navigation={navigation} />)}
    </View>
  )
}