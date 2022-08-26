import React from 'react';
import { FlatList } from 'react-native';
import Task from './task';

export default class SearchResult extends React.PureComponent {

  _keyExtractor = item =>  item.id;

  _renderItem = ({item}) => {
    const { onPress } = this.props;
    return <Task item={item} onPress={onPress} />
  };

  _getItemLayout = (data, index) => (
    {length: 92, offset: 92 * index, index}
  );

  render() {
    const { items } = this.props;
    if (!items || items.length < 1) return null;

    return (
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        data={items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        getItemLayout={this._getItemLayout}
      />
    );
  }

}