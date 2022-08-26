import React from 'react';
import { FlatList } from 'react-native';
import Task from './task';
import Event from './event';

export default class myWorkFolders extends React.PureComponent {

  _keyExtractor = item =>  item.id;

  _renderItem = ({item}) => {
    const { onTaskPress, onEventPress } = this.props;

    if (item.type == gd.const.myWork.type.TASK) {
      return <Task item={item} onPress={onTaskPress} />
    } else if (item.type == gd.const.myWork.type.EVENT) {
      return <Event item={item} onPress={onEventPress} />;
    }

    return null;
  };

  _getItemLayout = (data, index) => (
    {length: 92, offset: 92 * index, index}
  );

  render() {
    const { items } = this.props;
    if (!items || items.length < 1) return null;

    let list = [];
    items.map(item => {
      list.push(item);
    });

    return (
      <FlatList
        data={list}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        getItemLayout={this._getItemLayout}
      />
    );
  }
}