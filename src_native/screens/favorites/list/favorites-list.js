import React from 'react';
import { SectionList } from 'react-native';
import {
  ListItem, Body, Text
} from 'native-base';
import Task from './task';
import Project from './project';

export default class FavoritesList extends React.PureComponent {

  _keyExtractor = (item, index) =>  item.id;

  _renderItem = ({item}) => {
    const { onProject, onTask } = this.props;

    return  item.type == 'project'
      ? <Project item={item} onPress={onProject} />
      : <Task item={item} onPress={onTask} />
  };

  _renderSectionHeader = ({section}) => {
    return (
      <ListItem>
        <Body>
          <Text note>{section.title}</Text>
        </Body>
      </ListItem>
    )
  };

  render() {
    const { sections } = this.props;
    if (!sections || sections.length < 1) return null;

    return (
      <SectionList
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        sections={sections}
      />
    );
  }

}