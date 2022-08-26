import React, { Component } from 'react';
import { Dimensions, InteractionManager, Platform, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';
import {
  StyleProvider, Container, Footer, Title, Content,
  Body, Left, Right,
  Icon, Text, Button,
  Item,
  Grid, Row, Col, View
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import TaskTypeIcon from '../../components/icon/task-type-icon';
//import Controls from './controls-old';
import ControlsHeader from './controls/controls-header';
import ControlsFields from './controls/controls-fields';
import Messages from './messages';
import TaskInfo from './task-info';
import Pending from './pending';
import LoadingContent from '../common/loading-content';
import ReportScreen from './TimeReportScreen'
import HorizontalNav from './horizontal-nav'
import ActionsNav from './actions-nav'
import { AR_NO_ACTION_REQUIRED } from '../../common/constants';

import actionSheetGenerator from '../../common/actionSheetGenerator'

class TaskView extends Component {
  constructor(props) {
    super(props);
    this.selectStatus = this.selectStatus.bind(this);
    this.openSelectStatusScreen = this.openSelectStatusScreen.bind(this);

    this.selectSchedule = this.selectSchedule.bind(this);
    this.openSelectScheduleScreen = this.openSelectScheduleScreen.bind(this);

    this.selectPriority = this.selectPriority.bind(this);
    this.openSelectPriorityScreen = this.openSelectPriorityScreen.bind(this);

    this.selectProgress = this.selectProgress.bind(this);
    this.openSelectProgressScreen = this.openSelectProgressScreen.bind(this);

    this.selectDeadline = this.selectDeadline.bind(this);
    this.openSelectDeadlineScreen = this.openSelectDeadlineScreen.bind(this);

    this.selectStartDate = this.selectStartDate.bind(this);
    this.openSelectStartDateScreen = this.openSelectStartDateScreen.bind(this);
    this.selectEndDate = this.selectEndDate.bind(this);
    this.openSelectEndDateScreen = this.openSelectEndDateScreen.bind(this);

    this.selectEstimate = this.selectEstimate.bind(this);
    this.openSelectEstimateScreen = this.openSelectEstimateScreen.bind(this);
    this.handleDeleteMessage = this.handleDeleteMessage.bind(this);
    this.handleUpdateMessage = this.handleUpdateMessage.bind(this)

    this.handleMore = this.handleMore.bind(this);
    this.showMessageScreen = this.showMessageScreen.bind(this);
    this.openTaskInfoScreen = this.openTaskInfoScreen.bind(this);
    this.openTimeReportScreen = this.openTimeReportScreen.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleChangeTaskName = this.handleChangeTaskName.bind(this)
    this.handleDeleteTask = this.handleDeleteTask.bind(this)
    this.selectUserFromList = this.selectUserFromList.bind(this);
    this.openSelectUserScreen = this.openSelectUserScreen.bind(this);

    this.controlsActions = {
      showMessageScreen: this.showMessageScreen,
      openTaskInfoScreen: this.openTaskInfoScreen,
      openTimeReportScreen: this.openTimeReportScreen,
      openSelectStatusScreen: this.openSelectStatusScreen,
      openSelectScheduleScreen: this.openSelectScheduleScreen,
      openSelectPriorityScreen: this.openSelectPriorityScreen,
      openSelectProgressScreen: this.openSelectProgressScreen,
      openSelectDeadlineScreen: this.openSelectDeadlineScreen,
      openSelectStartDateScreen: this.openSelectStartDateScreen,
      openSelectEndDateScreen: this.openSelectEndDateScreen,
      openSelectEstimateScreen: this.openSelectEstimateScreen,
      openReplyScreen: () => props.navigation.navigate('task_reply'),
      handleMore: this.handleMore,
      openSelectUserScreen: this.openSelectUserScreen
    };

    this.onOrientation = this.onOrientation.bind(this);
    this.onLayout = this.onLayout.bind(this);

    const { task } = props;

    let arUserId = null;
    if (task.users.length === 1 && task.actionRequiredUserId) arUserId = task.actionRequiredUserId; // see if self task
    if (task.users.length === 1 && !task.actionRequiredUserId) arUserId = AR_NO_ACTION_REQUIRED; // self task with no AR


    this.state = {
      messagesHeight: 0,
      splash: true,
      showExtraFields: false,
      orientation: null,
      showMessageScreen: true,
      showTaskInfoScreen: false,
      showTimeReportScreen: false,
      activeTab: 0,
      userId: arUserId
    };
    this.blocksHeight = {};
    this.blocksHeight.footer = 2;
    // else this.blocksHeight.footer = 2;
  }
  handleMore() {
    const { showExtraFields } = this.state;
    const compMessages = this.refs.messages;
    if (!showExtraFields) {
      compMessages && compMessages.scrollToTopByUser();
      this.setState({ showExtraFields: true });
    } else {
      if (compMessages) {
        if (compMessages.myScrollPosition === undefined || compMessages.myScrollPosition < 30) {
          this.setState({ showExtraFields: false });
        }
        compMessages.scrollToTopByUser();
      }
    }
  }

  showMessageScreen() {
    this.setState({ showMessageScreen: true, showTaskInfoScreen: false, showTimeReportScreen: false });
  }

  openTaskInfoScreen() {
    this.setState({ showTaskInfoScreen: true, showMessageScreen: false, showTimeReportScreen: false });
  }

  openTimeReportScreen() {
    this.setState({ showTimeReportScreen: true, showMessageScreen: false, showTaskInfoScreen: false });
  }

  onPressMore = actionSheetGenerator({
    'Rename': {
      label: 'Rename task',
      action: () => {
        this.props.navigation.navigate('task_rename', {
          task: this.props.task,
          onChangeText: this.handleChangeTaskName
        })
      }
    },
    'Add': {
      label: 'Add time report',
      action: () => {
        this.props.navigation.navigate('add_time_report')
      }
    },
    'Delete': {
      label: 'Delete task',
      action: () => this.handleDeleteTask()
    },
    'Move': {
      label: 'Move to folder',
      action: () => {
        this.props.navigation.navigate('project_folder', {
          task: this.props.task
        })
      }
    },
    Cancel: {
      label: 'Cancel',
      cancel: true
    }
  })

  render() {
    const { task, navigation, me, actions } = this.props;
    const { showExtraFields, activeTab } = this.state;
    let pathArray = [];
    const parentId = task.hierarchy.get("t-" + task.id).parentId;
    let parent = task.hierarchy.get(parentId);
    while (parent) {
      pathArray.unshift(parent);
      parent = task.hierarchy.get(parent.parentId);
    }
    let titleArr = [];
    pathArray.map((p, i) => {
      titleArr.push(p.type === "project" ? p.item.name : p.item.title)
    });
    const title = titleArr.join(' / ');

    const project = gd.session.projects.get(task.projectId);
    const taskType = gd.session.taskTypes.get(task.taskTypeId);


    const headerBg = '#' + gd.const.project.color[project.color];

    const messagesProps = {};
    const { messagesHeight, splash } = this.state;
    if (messagesHeight > 10) messagesProps.style = { height: messagesHeight };

    const footerAdd = {};
    if (task.isOpen) footerAdd['gd-footer-task-view'] = true;
    else footerAdd['gd-footer-task-closed-view'] = true;
    // if (!isIphoneX()) footerAdd.onLayout = e => { this.onLayout(e, 'footer') };

    const iconPropsAdd = {};
    if (theme.platform == 'ios') {
      iconPropsAdd.style = { color: '#ffffff' };
    }

    let c1Size = 4;
    let c2Size = 3;
    if (Dimensions.get('window').width <= 320) {
      c1Size = 5;
      c2Size = 3;
    }

    //const compControls = <Controls task={task} actions={this.controlsActions} />
    const compControls = showExtraFields ? <ControlsFields task={task} actions={this.controlsActions} /> : false;

    const navNames = ['Messages', 'Info', 'Time reports']
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader noShadow noBottomBorder style={{ backgroundColor: headerBg }} onLayout={e => { this.onLayout(e, 'header') }}>
            <Left>
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" {...iconPropsAdd} />
              </Button>
            </Left>
            <Body>
              <Title ellipsizeMode="head">{title}</Title>
            </Body>
            <Right>
              {/* <Button transparent onPress={this.handleRefresh}>
                <Icon name="refresh" {...iconPropsAdd} />
              </Button> */}
            </Right>
          </ColorHeader>
          {splash
            ?
            <LoadingContent />
            :
            <Content scrollEnabled={false}>
              <View style={styles.row} onLayout={e => { this.onLayout(e, 'subHeader') }}>
                <Text style={styles.headerTitle} numberOfLines={1}>{task.title}</Text>
                {/*
                  <TouchableOpacity style={styles.btnAdd} onPress={() => navigation.navigate('add_time_report')}>
                    <View style={styles.btnAddBg}>
                      <Icon name="md-add" style={styles.addIcon} />
                    </View>
                  </TouchableOpacity>
                  */}
                <TouchableOpacity
                  style={styles.btnDots}
                  onPress={this.onPressMore.bind(this)}
                >
                  <Icon name="ios-more" />
                </TouchableOpacity>
              </View>
              <View onLayout={e => { this.onLayout(e, 'controlsRow') }}>
                <HorizontalNav
                  titles={navNames}
                  activeTab={activeTab}
                  setTab={index => this.setState({ activeTab: index })}
                />
                {activeTab === 0 && (
                  <ActionsNav task={task} actions={this.controlsActions} />
                )}
              </View>
              <Grid>
                {/*<ControlsHeader task={task} actions={this.controlsActions} onLayout={e => { this.onLayout(e, 'controlsRow') }} status={this.state} />*/}
                {messagesProps.style &&
                  <Row {...messagesProps}>
                    {activeTab === 0 &&
                      <Messages
                        task={task}
                        me={me}
                        navigation={navigation}
                        compControls={compControls}
                        onPressMore={message =>
                          navigation.navigate('edit_message', {
                            task,
                            message,
                            onChangeText: this.handleUpdateMessage
                          })
                        }
                        onPressDeleteMessage={this.handleDeleteMessage}
                        ref="messages"
                      />
                    }
                    {activeTab === 1 && (
                      <TaskInfo
                        task={task}
                        me={me}
                        actions={this.controlsActions}
                      />
                    )}
                    {activeTab === 2 && <ReportScreen task={task} me={me} />}
                  </Row>
                }
              </Grid>
            </Content>
          }
          {activeTab === 0 &&
            <Footer {...footerAdd} style={{ backgroundColor: 'white', margin: 0, padding: 0, height: 80 }}>

              {task.isOpen &&
                <View style={{ flex: 1, }}>
                  {/*
                    <Row style={{ paddingHorizontal: theme.listItemPadding, height: 0, paddingBottom: 30, alignSelf: 'flex-start' }}>
                      <Pending task={task} />
                    </Row>
                    */}
                  <Row style={{ paddingHorizontal: theme.listItemPadding }}>
                    <Col style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignContent: 'center', margin: 4 }}>
                      <Button onPress={() => navigation.navigate('task_reply')}
                        style={styles.btnReply}>
                        <Text style={{ textAlign: 'center', flex: 1 }}>Reply</Text>
                      </Button>
                    </Col>
                    <Col style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignContent: 'center', margin: 4 }}>
                      <Button onPress={() => navigation.navigate('task_reply')}
                        style={{ width: '100%' }}
                        color='white'
                        bordered={true}>
                        <Text style={{ textAlign: 'center', flex: 1 }}>Comment</Text>
                      </Button>
                    </Col>
                  </Row>
                </View>}
              {!task.isOpen &&
                <View>
                  <Row size={c1Size} style={{ paddingHorizontal: theme.listItemPadding, paddingTop: 5 }}>
                    <Pending task={task} />
                  </Row>
                  <Row size={c2Size} style={{ paddingHorizontal: theme.listItemPadding }}>
                    <Button block onPress={() => navigation.navigate('task_reply')}>
                      <Text>Re-open task</Text>
                    </Button>
                  </Row>
                </View>}
            </Footer>
          }
          {activeTab === 2 &&
            <Footer {...footerAdd} style={{ backgroundColor: 'white', margin: 0, }}>

              {task.isOpen &&
                <View style={{ flex: 1 }}>
                  <Row style={{ paddingHorizontal: theme.listItemPadding }}>
                    <Col></Col>
                    <Col style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignContent: 'center', margin: 4 }}>
                      <Button onPress={() => navigation.navigate('add_time_report')}
                        style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', flex: 1 }}>+ Time Report</Text>
                      </Button>
                    </Col>
                  </Row>
                </View>}
            </Footer>
          }

        </Container>
      </StyleProvider>
    );
  }
  componentDidMount() {
    Dimensions.addEventListener('change', this.onOrientation);
    InteractionManager.runAfterInteractions(() => {
      this.setState({ splash: false })
    });
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onOrientation);
  }
  onOrientation({ window }) {
    this.blocksHeight = {};
    this.blocksHeight.footer = 2;
    this.setState({
      messagesHeight: 0,
      orientation: window.height > window.width ? 'portrait' : 'landscape',
    });
  }
  onLayout(e, block) {
    this.blocksHeight[block] = e.nativeEvent.layout.height;

    let allBlocks = true;
    ['header', 'subHeader', 'controlsRow', 'footer'].some(el => {
      if (!this.blocksHeight[el]) {
        allBlocks = false;
        return true;
      }
    });

    if (allBlocks) {
      if (this.state.messagesHeight > 0) return;
      const { height } = Dimensions.get('window');
      let otherBlocksHeight = 0;
      for (let property in this.blocksHeight) {
        otherBlocksHeight += this.blocksHeight[property];
      }
      let statusBarFix = 0;
      if (Platform.OS === 'android') statusBarFix = getStatusBarHeight();
      const messagesHeight = parseInt(height - otherBlocksHeight - statusBarFix) - 1;
      this.setState({ messagesHeight });
    }
  }
  openSelectUserScreen() {
    const { task } = this.props;
    const { userId } = this.state;
    const projectId = task.projectId;
    const companyId = gd.session.projects.get(projectId).companyId;
    this.props.navigation.navigate('select_user', {companyId, projectId, userId, task, onPress:this.selectUserFromList});
  }
  selectUserFromList(userId) {
    const { task, actions } = this.props;
    console.log('selectUserFromList', userId)
    this.setState({userId, errors:{}});
    actions.updateTaskArUser(task, userId)
  }
  selectStatus(statusId) {
    const { task, actions } = this.props;
    if (!statusId || task.taskStatusId == statusId) return;
    actions.updateTaskStatus(task, statusId);
  }
  openSelectStatusScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_status', { projectId: task.projectId, taskTypeId: task.taskTypeId, onPress: this.selectStatus });
  }
  selectSchedule(date) {
    const { task, actions } = this.props;

    actions.updateTaskSchedule(task, date);
  }
  openSelectScheduleScreen() {
    const { task, me } = this.props;
    if (!me || !me.id) return;
    if (!task.actionRequiredUserId) return;
    if (task.actionRequiredUserId != me.id) return;
    this.props.navigation.navigate('select_date', { date: task.scheduleDate, onPress: this.selectSchedule, showTodayTomorrowSomeday: true });
  }
  selectPriority(priorityId) {
    const { task, actions } = this.props;
    console.log('selectPriority', 'taskId', task.id, 'newPriority', priorityId, 'oldPriority', task.priority);


    if (task.priority == priorityId || priorityId < 1) return;

    if (priorityId == gd.const.priority.levels.blocker) {
      return;
    } else if (priorityId == gd.const.priority.levels.emergency) {
      return;
    }

    actions.updateTaskPriority(task, priorityId);
  }
  openSelectPriorityScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_priority', { companyId: task.companyId, onPress: this.selectPriority });
  }
  selectProgress(progress) {
    const { task, actions } = this.props;

    actions.updateTaskProgress(task, progress);
  }
  openSelectProgressScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_progress', { value: task.progress, onPress: this.selectProgress });
  }
  selectDeadline(date) {
    const { task, actions } = this.props;

    actions.updateTaskDeadline(task, date);
  }
  openSelectDeadlineScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_date', { date: task.deadline, onPress: this.selectDeadline, showClear: true });
  }
  selectStartDate(startDate) {
    const { task, actions } = this.props;
    var self = this;
    const endDate = task.endDate ? task.endDate : startDate;
    actions.updateTaskStartEnd(task, startDate, endDate);
    if (startDate !== null)
      setTimeout(function () { self.openSelectEndDateScreen() }, 100);
  }

  openSelectStartDateScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_date', { minDate: null, date: task.startDate, onPress: this.selectStartDate, showClear: true, title: 'Select start date' });
  }

  selectEndDate(endDate) {
    const { task, actions } = this.props;
    const startDate = task.startDate ? task.startDate : endDate;
    actions.updateTaskStartEnd(task, startDate, endDate);
  }
  openSelectEndDateScreen() {
    const { task } = this.props;
    let minDate = null;
    if (task.startDate) minDate = task.startDate.endOf('day');
    this.props.navigation.navigate('select_date', { minDate: minDate, date: task.endDate, onPress: this.selectEndDate, showClear: true, title: 'Select end date' });
  }
  selectEstimate(estimate) {
    const { task, actions } = this.props;

    actions.updateTaskEstimate(task, estimate);
  }
  openSelectEstimateScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_estimate', { value: task.estimate, onPress: this.selectEstimate });
  }
  handleRefresh() {
    this.props.actions.loadTask(this.props.task.id);
  }
  handleDeleteMessage(messageID) {
    const { task, actions } = this.props;
    actions.deleteTaskMessage(task, messageID);
  }
  handleUpdateMessage(text, message) {
    const { task, actions } = this.props;
    actions.updateTaskMessage(task, message, text);
  }
  handleChangeTaskName(text) {
    const { task, actions } = this.props;
    actions.changeTaskName(task, text);
  }
  handleDeleteTask() {
    const { task, actions, navigation } = this.props;
    actions.deleteTask(task);
    navigation.goBack()
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  headerTitle: {
    flex: 1,
    color: '#333333',
    fontSize: 19,
    fontFamily: 'OpenSans-Bold',
    padding: 16
  },
  btnAdd: {
    padding: 16,
    paddingRight: 8
  },
  btnAddBg: {
    top: 3,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4498F7',
    borderRadius: 4
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 24
  },
  btnDots: {
    padding: 16,
    paddingLeft: 8
  },
  btnReply: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#4498F7'
  }
})

export default TaskView;
