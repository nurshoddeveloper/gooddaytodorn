import React, { Component } from 'react';
import { Dimensions, InteractionManager, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
  StyleProvider, Container, Header, Footer, Title, Content,
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
import Controls from './controls/controls-new-one-block';
import ControlsHeader from './controls/controls-header';
import ControlsFields from './controls/controls-fields';
import Messages from './messages';
import Pending from './pending';
import LoadingContent from '../../screens/common/loading-content';



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

    this.handleMore = this.handleMore.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);

    this.controlsActions = {
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
    };

    this.onOrientation = this.onOrientation.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.state = {
      messagesHeight: 0,
      splash: true,
      showExtraFields: false,
      orientation: null,
    };
    this.blocksHeight = {};
    if (isIphoneX()) this.blocksHeight.footer = 99;
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
  render() {
    const { task, navigation } = this.props;
    const { showExtraFields } = this.state;

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

    //console.log('taskStatus', taskStatus);

    const headerBg = '#' + gd.const.project.color[project.color];

    const messagesProps = {};
    const { messagesHeight, splash } = this.state;
    if (messagesHeight > 10) messagesProps.style = { height: messagesHeight };

    const footerAdd = {};
    if (task.isOpen) footerAdd['gd-footer-task-view'] = true;
    else footerAdd['gd-footer-task-closed-view'] = true;
    if (!isIphoneX()) footerAdd.onLayout = e => { this.onLayout(e, 'footer') };

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
              <Button transparent onPress={this.handleRefresh}>
                <Icon name="refresh" {...iconPropsAdd} />
              </Button>
            </Right>
          </ColorHeader>
          {splash
            ?
            <LoadingContent />
            :
            <Content scrollEnabled={false}>
              <View gd-task-view-subheader style={{ backgroundColor: headerBg }} onLayout={e => { this.onLayout(e, 'subHeader') }}>
                <Item task-title-icon>
                  <TaskTypeIcon taskType={taskType} inHeader />
                  <Text numberOfLines={3}>{task.title}</Text>
                </Item>
                <Item task-title-number-holder>
                  <Item task-title-number style={{ backgroundColor: theme.darkenTaskNumberColor(headerBg) }}>
                    <Text ttn-hash>#</Text>
                    <Text ttn-number>{task.shortId}</Text>
                  </Item>
                </Item>
              </View>
              <Grid>
                <ControlsHeader task={task} actions={this.controlsActions} onLayout={e => { this.onLayout(e, 'controlsRow') }} />
                {/*<Controls task={task} actions={this.controlsActions} onLayout={e => {this.onLayout(e, 'controlsRow')}} />*/}
                {messagesProps.style &&
                  <Row {...messagesProps}>
                    <Col>
                      <Messages task={task} navigation={navigation} compControls={compControls} ref="messages" />
                    </Col>
                  </Row>
                }
              </Grid>
            </Content>
          }
          {!splash &&
            <Footer {...footerAdd}>
              {<Grid>
                {task.isOpen &&
                  <Row>
                    <Col size={c1Size} style={{ paddingHorizontal: theme.listItemPadding, paddingTop: 5 }}>
                      <Pending task={task} />
                    </Col>
                    <Col size={c2Size} style={{ paddingHorizontal: theme.listItemPadding }}>
                      <Button block onPress={() => navigation.navigate('task_reply')}>
                        <Text>Reply</Text>
                      </Button>
                    </Col>
                  </Row>}
                {!task.isOpen &&
                  <Row>
                    <Col style={{ paddingHorizontal: theme.listItemPadding }}>
                      <Button block onPress={() => navigation.navigate('task_reply')}>
                        <Text>Re-open task</Text>
                      </Button>
                    </Col>
                  </Row>}
              </Grid>}
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
    this.setState({
      messagesHeight: 0,
      orientation: window.height > window.width ? 'portrait' : 'landscape',
    });
  }
  onLayout(e, block) {
    //console.log('onLayout', block, e.nativeEvent.layout);
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
      //console.log('all blocks processed', this.blocksHeight);
      const { height } = Dimensions.get('window');
      let otherBlocksHeight = 0;
      for (let property in this.blocksHeight) {
        otherBlocksHeight += this.blocksHeight[property];
      }
      let statusBarFix = 0;
      if (Platform.OS === 'android') statusBarFix = getStatusBarHeight();
      const messagesHeight = parseInt(height - otherBlocksHeight - statusBarFix) - 1;
      //console.log('height', height);
      //console.log('otherBlocksHeight', otherBlocksHeight);
      //console.log('messagesHeight', messagesHeight);
      this.setState({ messagesHeight });
    }
  }
  selectStatus(statusId) {
    const { task, actions } = this.props;
    console.log('selectStatus', 'taskId', task.id, 'newStatusId', statusId, 'oldStatusId', task.taskStatusId);
    if (!statusId || task.taskStatusId == statusId) return;
    actions.updateTaskStatus(task, statusId);
  }
  openSelectStatusScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_status', { projectId: task.projectId, taskTypeId: task.taskTypeId, onPress: this.selectStatus });
  }
  selectSchedule(date) {
    const { task, actions } = this.props;
    console.log('selectSchedule', date);

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
    console.log('selectProgress', progress);

    actions.updateTaskProgress(task, progress);
  }
  openSelectProgressScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_progress', { value: task.progress, onPress: this.selectProgress });
  }
  selectDeadline(date) {
    const { task, actions } = this.props;
    console.log('selectDeadline', date);

    actions.updateTaskDeadline(task, date);
  }
  openSelectDeadlineScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_date', { date: task.deadline, onPress: this.selectDeadline, showClear: true });
  }
  selectStartDate(startDate) {
    const { task, actions } = this.props;
    console.log('selectStartDate', startDate);
    const endDate = task.endDate ? task.endDate : startDate;

    actions.updateTaskStartEnd(task, startDate, endDate);
  }
  openSelectStartDateScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_date', { minDate: null, date: task.startDate, onPress: this.selectStartDate, showClear: true, title: 'Select start date' });
  }
  selectEndDate(endDate) {
    const { task, actions } = this.props;
    console.log('selectEndDate', endDate);
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
    console.log('selectEstimate', estimate);

    actions.updateTaskEstimate(task, estimate);
  }
  openSelectEstimateScreen() {
    const { task } = this.props;
    this.props.navigation.navigate('select_estimate', { value: task.estimate, onPress: this.selectEstimate });
  }
  handleRefresh() {
    this.props.actions.loadTask(this.props.task.id);
  }
}

export default TaskView;
