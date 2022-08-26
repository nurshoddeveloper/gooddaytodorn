import React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import { Text } from 'native-base';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import theme from '../../../app-theme/variables/platform';
import ActivityListItem from './activity-list-item';


export default class ActivityStreamList extends React.PureComponent {

  // constructor(props) {
  //   super(props);
  //
  //   const { activities } = props;
  //   const sections = [];
  //   const added = [];
  //   if (activities) {
  //     activities.forEach(act => {
  //       sections.push({title: act.date.format('dddd, MMM D'), data: [act]});
  //     });
  //     //added.push(sections[0]);
  //   }
  //   console.log('sections', sections);
  //
  //   this.state = {
  //     full: sections,
  //     added: sections,
  //     step: 1,
  //   };
  // }

  //_keyExtractor = (item, index) =>  index;
  _keyExtractor = (item, index) =>  {
    //console.log('index', index, 'item', item);
    let key = 'idx-' + index;
    if (index === null) key = 't-' + item.title;
    if (item.date) key = 'ms-' + item.date.valueOf();
    //console.log('key', key)
    return key;
  };

  _renderItem = ({ item }) => {
    const { onProject, onTask, onEvent } = this.props;
    return <ActivityListItem items={item.updates} onProject={onProject} onTask={onTask} onEvent={onEvent} />
  };

  _renderSectionHeader = ({section}) => {
    return (
      <Text asl-section-title>{section.title}</Text>
    )
  };

  _renderSectionSeparator = (obj) => {
    return obj.leadingItem && obj.trailingSection
      ? <View style={{height: StyleSheet.hairlineWidth, marginTop: 11, marginBottom: 10, backgroundColor: theme.listBorderColor}} />
      : null;
  };

  _onViewableItemsChanged = (obj) => {
    console.log('_onViewableItemsChanged', obj)
  };

  _getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => 50,
    // These three properties are optional
    getSeparatorHeight: () => 0, // The height of your separators
    getSectionHeaderHeight: () => 0, // The height of your section headers
    getSectionFooterHeight: () => 0, // The height of your section footers
    listHeaderHeight: 36,
  });

//   componentDidMount() {
//     const { full, added, step } = this.state;
// console.log('componentDidMount')
//     if (full.length > added.length) {
//       this.timer = setTimeout(() => {
//         this._addSectionsForNextStep();
//       }, 1000)
//     }
//   }

  // _addSectionsForNextStep() {
  //   const { full, step } = this.state;
  //   console.log('_addSectionsForNextStep')
  //   const nextStep = step + 1;
  //   const sections = full.slice(0, nextStep);
  //   this.setState({ added: sections, step: nextStep});
  //
  //   if (sections.length < full.length) {
  //     console.log('nextStep', nextStep);
  //     console.log('sections.length', sections.length);
  //     clearTimeout(this.timer);
  //     this.timer = setTimeout(() => {
  //       this._addSectionsForNextStep();
  //     }, 1000)
  //   } else {
  //     clearTimeout(this.timer);
  //   }
  //
  //}

  // componentWillUnmount() {
  //   clearTimeout(this.timer)
  // }

  render() {
    const { activities } = this.props;
    if (!activities || activities.length < 1) return null;

    const sections = [];
    activities.forEach(act => {
      sections.push({title: act.date.format('dddd, MMM D'), data: [act]});
    });
    console.log('sections', sections);
    //const sections = this.state.added;

    return (
      <SectionList
        keyExtractor={this._keyExtractor}
        //onViewableItemsChanged={this._onViewableItemsChanged}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        SectionSeparatorComponent={this._renderSectionSeparator}
        sections={sections}
        //getItemLayout={this._getItemLayout}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
      />
    );
  }

}