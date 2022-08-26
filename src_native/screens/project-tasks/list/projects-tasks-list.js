import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import Task from './task';
import Project from './project';
import theme from '../../../app-theme/variables/platform';



export default class ProjectsTasksList extends React.PureComponent {

  _keyExtractor = item =>  item.id;

  _renderItem = ({item}) => {
    const { onProject, onTask } = this.props;

    return  item.type == 'project'
      ? <Project item={item.item} onPress={onProject}/>
      : <Task item={item.item} onPress={onTask} />
  };

  _renderSeparator = (obj) => {
    return <View style={{height: StyleSheet.hairlineWidth, marginBottom: StyleSheet.hairlineWidth, /*theme.borderWidth,*/ backgroundColor: 'red'}} />;
  };

  _getItemLayout = (data, index) => (
    {length: 92, offset: 92 * index, index}
  );

  render() {
    const { items } = this.props;
    if (!items || items.length < 1) return null;

    return (
      <FlatList
        data={items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        getItemLayout={this._getItemLayout}
        //ItemSeparatorComponent={this._renderSeparator}
      />
    );
  }

}