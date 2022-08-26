import React, { PureComponent } from 'react';
import {
  Left, Body, Right,
  Button, Icon, Text, Col,
  ListItem, Item, View
} from 'native-base';
import theme from '../../app-theme/variables/platform';
import _ from 'lodash';
import { SectionList, StyleSheet } from 'react-native';
import UserIcon from '../../components/icon/user-icon';
import Message from './message/message';
import MessageNoReply from './message/no-reply';
import MessageMove from './message/move';
import MessageSchedule from './message/schedule';
import MessageView from './message/view';
import MessagePriority from './message/priority';
import MessageReassign from './message/reassign';
import MessageArChange from './message/ar-change';
import Pending from '../task-view/pending';

import actionSheetGenerator from '../../common/actionSheetGenerator'

export default class Messages extends PureComponent {
  constructor(props) {
    super(props);

    this._onContentSizeChange = this._onContentSizeChange.bind(this);
    this.debouncedOnContentSizeChange = _.debounce(this._onContentSizeChange, 200);
    this.userTouched = false;

  }
  render() {
    const { task, compControls, navigation } = this.props;
    //const messages = task.messages.filterByLevel(2);
    const messages = filterMessagesByLevel(task, 2);
    // fix Empty first message
    if (!messages[0].message) {
      messages[0].message = task.title;
    }

    // convert array of messges into array of groups
    let groupedMessages = [];
    let curFromUserId = null;
    let curDate = null;
    let curBlock = [];
    messages.map(message => {

      if (curFromUserId !== message.fromUserId || curDate !== message.momentCreated.format('YYYY-MM-DD')) {
        if (curBlock && curBlock.length > 0) groupedMessages.push(curBlock);
        curBlock = [];
        curFromUserId = message.fromUserId;
        curDate = message.momentCreated.format('YYYY-MM-DD');
      }

      curBlock.push(message);
    });
    groupedMessages.push(curBlock);

    //console.log('groupedMessages', groupedMessages);

    const sections = [];

    if (compControls) sections.push({ data: [], compControls });

    groupedMessages.forEach(arrMsgs => {
      const message = arrMsgs[0];
      sections.push({ data: arrMsgs, message });
    });

    //return null;
    const initialNumToRender = messages.length > 6 ? 6 : messages.length;

    return (
      <Col style={{ flex: 1 }}>
        <SectionList
          bounces={false}
          ref={(c) => this.messageList = c}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          ListFooterComponent={() => (<View style={{ height: 120 }} />)}
          //ItemSeparatorComponent={this._renderSeparator}
          sections={sections}
          initialNumToRender={initialNumToRender}
          onContentSizeChange={this.debouncedOnContentSizeChange}
          onScrollBeginDrag={() => { if (!this.userTouched) { this.userTouched = true; this.debouncedOnContentSizeChange.cancel(); } }}
          onScroll={(event) => {
            //console.log('event', event.nativeEvent.contentOffset.y)
            this.myScrollPosition = event.nativeEvent.contentOffset.y;
          }}
        />
      </Col>
    );
  }

  componentWillUnmount() {
    //debounced link
    this.debouncedOnContentSizeChange.cancel();
  }

  _onContentSizeChange() {
    if (this.userTouched) return;
    this.scrollToBottom();
  }

  scrollToTopByUser() {
    this.userTouched = true;
    this.debouncedOnContentSizeChange.cancel();
    //this.messageList && this.messageList._wrapperListRef._listRef.scrollTo(0, {animated: false});
    this.messageList && this.messageList._wrapperListRef._listRef.scrollToOffset({ offset: 0, animated: true });
    //this.messageList && this.messageList.scrollToLocation({sectionIndex:0, itemIndex:0, viewPosition:0, animated: true});
  }

  scrollToBottom() {
    this.messageList && this.messageList._wrapperListRef._listRef.scrollToEnd({ animated: false });
  }

  _keyExtractor = (item, index) => item.id;

  onPressMore = message => actionSheetGenerator({
    'Edit': {
      label: 'Edit',
      action: () => this.props.onPressMore(message)
    },
    'Delete': {
      label: 'Delete message',
      action: () => this.props.onPressDeleteMessage(message.id)
    },
    Cancel: {
      label: 'Cancel',
      cancel: true
    }
  })

  _renderItem = ({ item, index }) => {
    //console.log('item', item);
    const message = item;
    const { task, navigation } = this.props;
    let Component = null;

    switch (message.type) {
      case gd.const.taskMessage.type.FIRST:
      case gd.const.taskMessage.type.MESSAGE:
      case gd.const.taskMessage.type.TIME_REPORT:
        Component = _.size(message?.message) ? Message : null;
        break;
      case gd.const.taskMessage.type.NO_REPLY:
        Component = MessageNoReply;
        break;
      case gd.const.taskMessage.type.MOVE:
        Component = MessageMove;
        break;
      case gd.const.taskMessage.type.REASSIGN:
      case gd.const.taskMessage.type.AUTO_REASSIGN:
        Component = MessageReassign;
        break;
      case gd.const.taskMessage.type.AR_CHANGE:
        Component = MessageArChange;
        break;
      case gd.const.taskMessage.type.SCHEDULE_DATE:
      case gd.const.taskMessage.type.SCHEDULE_SOMEDAY:
        Component = MessageSchedule;
        break;
      case gd.const.taskMessage.type.VIEW:
        Component = MessageView;
        break;
      case gd.const.taskMessage.type.PRIORITY:
        Component = MessagePriority;
        break;
      case gd.const.taskMessage.type.SET_DEADLINE:
      case gd.const.taskMessage.type.CHANGE_DEADLINE:
      case gd.const.taskMessage.type.REMOVE_DEADLINE:
        //do not show
        break;
      default:
        console.log('Unknown message component', message.type, message.toJSON());
    }

    if (!Component) return null;

    return <Component message={message} task={task} navigation={navigation} onPressMore={this.onPressMore(message)} />;
  };

  __renderSeparator = (obj) => {
    return <View style={{ height: StyleSheet.hairlineWidth, marginBottom: StyleSheet.hairlineWidth, /*theme.borderWidth,*/ backgroundColor: 'red' }} />;
  };

  _renderSectionHeader = ({ section: { message, compControls } }) => {

    if (compControls) {
      return compControls;
    }

    const user = gd.session.users.get(message.fromUserId);
    const userName = user && user.name ? user.name : 'GoodDay';

    return (
      <ListItem gd-list-item-task-message-group style={{ backgroundColor: "white", height : 65}}>
        <Body>
          <Item>
            <UserIcon user={user} />
            <Text style={styles.userName}>{userName}</Text>
          </Item>
        </Body>
        <Right>
          <Text numberOfLines={1} style={styles.date}>
            {gd.utils.localWhen(message.momentCreated)}
          </Text>
        </Right>
      </ListItem>
    )
  };
}


function filterMessagesByLevel(task, level) {

  const messages = task.messages;

  switch (level) {
    case 1:
      return _.filter(messages, m => [1, 2, 3, 19].includes(m.type));
      break;
    case 2:
      return _.filter(messages, m => [1, 2, 3, 11, 12, 16, 18, 19].includes(m.type)); // 15, 13,14
      break;
    case 3:
      return _.filter(messages, m => [1, 2, 3, 10, 17, 11, 12, 13, 14, 15, 16, 19, 20, 21].includes(m.type));
      break;
    case 4:
      return messages;
      break;
    default:
      return [];
  }

}

const styles = StyleSheet.create({
  userName: {
    color: '#565656',
    fontSize: 15,
    fontFamily: 'OpenSans-Bold'
  },
  date: {
    color: '#565656',
    fontSize: 15,
    fontFamily: 'OpenSans-Regular'
  }
})
