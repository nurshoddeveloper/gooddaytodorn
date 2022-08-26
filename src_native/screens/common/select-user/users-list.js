import React from 'react';
import {
  ListItem, Left, Body, Text
} from 'native-base';
import { SectionList } from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import UserIcon from '../../../components/icon/user-icon';


export default class UsersList extends React.PureComponent {

  _keyExtractor = user => user.id;

  _renderItem = ({ item }) => {
    const { onPress, selectedId } = this.props;
    // onLayout={(e) => { console.log('layout', e.nativeEvent.layout)}}
    return (
      <ListItem gd-list-item selected={item.id == selectedId} button={true} onPress={() => onPress(item.id)}>
        <Left>
          <UserIcon user={item} />
        </Left>
        <Body>
          <Text numberOfLines={1}>{item.name}</Text>
        </Body>
      </ListItem>
    )
  };

  // _renderSectionHeader = ({ section }) => {
  //   return (
  //     <ListItem>
  //       <Body>
  //         <Text note>{section.title}</Text>
  //       </Body>
  //     </ListItem>
  //   )
  // };

  _getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => 50,
    // These three properties are optional
    getSeparatorHeight: () => 0, // The height of your separators
    getSectionHeaderHeight: () => 0, // The height of your section headers
    getSectionFooterHeight: () => 0, // The height of your section footers
    listHeaderHeight: 0,
  });


  render() {
    const { sections } = this.props;
    return (
      <SectionList
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        sections={sections}
        getItemLayout={this._getItemLayout}
      />
    )
  }

}