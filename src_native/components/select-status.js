import React, { PureComponent } from 'react';
import { Button, Text } from 'native-base';
import TaskStatusIcon from './icon/task-status-icon';

export default class SelectStatus extends PureComponent {

  render() {
    const { statusId } = this.props;
    return statusId ? this.renderValue() : this.renderTaskTypeStatuses();
  }
  renderValue() {
    const { statusId, onPress } = this.props;
    const status = gd.session.statuses.get(statusId);
    if (!status) return null;
    return (
      <Button transparent dark onPress={() => {onPress(status.id)}}>
        <TaskStatusIcon status={status} normal />
        <Text uppercase={false} style={{fontSize:16, lineHeight:20}}>{status.name}</Text>
      </Button>
    )
  }
  renderTaskTypeStatuses() {
    const { onPress } = this.props;
    return (
      <Button transparent dark onPress={() => {onPress(null)}} gd-button-no-left-padd>
        <Text uppercase={false}>Please select</Text>
      </Button>
    )
  }
}