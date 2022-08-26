import React from 'react';
import { FlatList } from 'react-native';
import Task from './task';
import Project from './project';

export default class FavoritesList extends React.PureComponent {

  _keyExtractor = (item, index) =>  item.id2;

  _renderItem = ({item}) => {
    const { onProject, onTask } = this.props;

    return  item.type == 'project'
      ? <Project item={item} onPress={onProject}/>
      : <Task item={item} onPress={onTask} />
  };

  render() {
    const { items } = this.props;
    if (!items || items.length < 1) return null;

    return (
      <FlatList
        data={items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }

}