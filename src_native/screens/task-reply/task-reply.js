import React, { Component } from 'react';
import {
  StyleProvider, Container, Header, Content,
  Body, Left, Right,
  Icon, Text, Button, Input, Spinner,
  List, ListItem, Item,
  Grid, Row,
  Toast, View
} from 'native-base';
import { StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import TaskTypeIcon from '../../components/icon/task-type-icon';
import SelectUser from '../../components/select-user';
import SelectStatus from '../../components/select-status';
import { SentryLogger } from '../../common/sentry';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AR_NO_ACTION_REQUIRED } from '../../common/constants';
import { getColorById } from '../../common/status-colors';
import AttachmentItem from '../../components/attachment-item';
import { getGlyphByName } from '../../common/icons';
import _ from 'lodash'
import DocumentPicker from 'react-native-document-picker';
import TimePicker from "react-native-24h-timepicker";
import TaskStatusManager from '../../../src_web/src/core/gd/manager/task-status-manager';

const styleSelect = { paddingLeft: theme.listItemPadding, paddingTop: 3 };
const styleMessage = { paddingLeft: theme.listItemPadding - 4};
const styleError = { paddingLeft: theme.listItemPadding, paddingTop: 5 };
const styleRowRoundBtn = { paddingTop: 21, /*alignSelf:'flex-end', flexDirection:'column', justifyContent: "flex-start",*/ /*borderWidth:1, borderColor:'red'*/ };
const headerHeight = theme.toolbarHeight + getStatusBarHeight() + 20;


class TaskReply extends Component {
  constructor(props) {
    super(props);

    this.setMessage = this.setMessage.bind(this);

    this.selectUser = this.selectUser.bind(this);
    this.openSelectUserScreen = this.openSelectUserScreen.bind(this);
    this.selectUserFromList = this.selectUserFromList.bind(this);

    this.selectStatus = this.selectStatus.bind(this);
    this.openSelectStatusScreen = this.openSelectStatusScreen.bind(this);
    this.selectStatusFromList = this.selectStatusFromList.bind(this);

    this.replyTask = this.replyTask.bind(this);

    this.handleDocPicker = this.handleDocPicker.bind(this)

    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)

    const { task, message } = props;
    let arUserId = null;
    if (task.users.length === 1 && task.actionRequiredUserId) arUserId = task.actionRequiredUserId; // see if self task
    if (task.users.length === 1 && !task.actionRequiredUserId) arUserId = AR_NO_ACTION_REQUIRED; // self task with no AR

    let curStatusId = null;
    if (task.isOpen) {
      curStatusId = task.taskStatusId;
    }

    if (task.isOpen === false) {
      let taskStatuses = TaskStatusManager.getTaskStatuses({projectId: task.projectId, taskTypeId: task.taskTypeId});
      const notStartedStatus = _.head(taskStatuses)
      const reopenStatus = notStartedStatus?.serialize()
      curStatusId = reopenStatus?.id
    }

    this.state = {
      userId: message?.fromUserId || arUserId,
      statusId: curStatusId,
      message: null,
      errors: {},
      submitting: false,
      attachments: [],
      keyboardHeight: theme.bottomSpace,
      reportedMinutes: null,
      reportedTime: null
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow(e) {
    this.setState({ keyboardHeight: e.endCoordinates.height })
  }
  _keyboardDidHide() {
    this.setState({ keyboardHeight: theme.bottomSpace })
  }

  onCancel() {
    this.TimePicker.close()
  }

  onConfirm(hour, minute) {
    this.setState({ reportedMinutes: (parseInt(hour) * 60) + parseInt(minute), reportedTime: `${hour}h.:${minute}m.` })
    this.TimePicker.close()
  }

  render() {
    const { task, navigation } = this.props;

    const project = gd.session.projects.get(task.projectId);
    const taskType = gd.session.taskTypes.get(task.taskTypeId);
    const taskUsers = task.users.map(tu => gd.session.users.get(tu.userId));

    const headerBg = '#' + gd.const.project.color[project.color];

    const backIconAdd = {};
    if (theme.platform == 'ios') {
      backIconAdd.style = {color: '#ffffff'};
    }

    const { errors, userId, statusId, submitting, message, attachments, keyboardHeight, reportedTime } = this.state;

    let row2Height = 10;
    let row2MarginTop = -10;
    if (theme.platform == 'ios') {
      row2Height = 15;
      row2MarginTop = -20;
    }

    const status = gd.session.statuses.get(statusId);
    const color = getColorById(status?.color);

    const glyphAttachment = String.fromCharCode(getGlyphByName('attachment'));
    const glyphTime = String.fromCharCode(getGlyphByName('time'));
    const glyphSend = String.fromCharCode(getGlyphByName('send-plane'));

    const maxInputHeight = theme.deviceHeight - keyboardHeight - theme.topSpace - theme.toolbarHeight - 190

    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader  style={{backgroundColor: headerBg, height: theme.toolbarHeight + row2Height}}>
            <Grid>
              <Row style={{height: theme.toolbarHeight}}>
                <Left>
                  <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" {...backIconAdd} />
                  </Button>
                </Left>
                <Body>
                    <Item task-title-icon><TaskTypeIcon taskType={taskType} inHeader /><Text numberOfLines={1}>{task.title}</Text></Item>
                </Body>
                <Right />
              </Row>
            </Grid>
          </ColorHeader>
          <Content>
            <List>
              <ListItem>
                <Body>
                  <Grid>
                    <Row><Text style={styles.title}>Action required:</Text></Row>
                    <Row style={styleSelect}>
                      <SelectUser onPress={this.selectUser} taskUsers={taskUsers} projectId={task.projectId} userId={userId}/>
                    </Row>
                    {errors.userId &&
                    <Row style={styleError}><Item error-create-task><Text>Please select user</Text></Item></Row>
                    }
                  </Grid>
                </Body>
                <Right style={styleRowRoundBtn}>
                  <Button gd-button-round-more onPress={this.openSelectUserScreen}>
                    <Icon name="ios-more"/>
                  </Button>
                  {errors.userId &&
                  <Row style={styleError}><Item error-create-task><Text>&nbsp;</Text></Item></Row>
                  }
                </Right>
              </ListItem>
              <ListItem noBorder>
                <Body>
                  <Grid>
                    <Row><Text style={styles.title}>Message:</Text></Row>
                    <Row style={styleMessage} scrollEnabled={true}>
                      <Input
                        value={message}
                        placeholder="Please enter message..."
                        multiline={true}
                        numberOfLines={maxInputHeight / 30}
                        style={styles.input}
                        maxHeight={maxInputHeight}
                        onChangeText={this.setMessage}
                        // onEndEditing={this.replyTask}
                      />
                    </Row>
                    {errors.message &&
                    <Row style={styleError}><Item error-create-task><Text>Please enter message</Text></Item></Row>
                    }
                  </Grid>
                </Body>
              </ListItem>
              {_.map(attachments, (item, key) => {
                return (
                  <AttachmentItem
                    key={key}
                    title={item.fileName}
                    onPressDelete={() => {
                      this.setState(oldState => ({
                        attachments: [
                          ...oldState.attachments.slice(0, key),
                          ...oldState.attachments.slice(key + 1)
                        ]
                      }))
                    }}
                  />
                )
              })}
            </List>
          </Content>
          <View style={[styles.footer, { marginBottom: keyboardHeight - theme.bottomSpace }]}>
            <TouchableOpacity style={styles.footerRound} onPress={this.handleDocPicker}>
              <Text gd-icon style={styles.glyphIcon}>{glyphAttachment}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerStatus, styles.timerBtn]}
              onPress={() => {
                if (reportedTime) {
                  this.setState({ reportedTime: null })
                } else {
                  this.TimePicker.open()
                }
              }}
            >
              <Text gd-icon style={styles.glyphIcon}>{glyphTime}</Text>
              {!!reportedTime && (
                <Text style={styles.timerTitle}>{reportedTime}</Text>
              )}
              {!!reportedTime && (
                <Icon name="md-close-circle" style={styles.closeIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerStatus} onPress={this.openSelectStatusScreen}>
              <Text style={[styles.statusTitle, { color: color }]}>
                {status?.name}
              </Text>
            </TouchableOpacity>
            <View flex={1} />
            <TouchableOpacity style={styles.footerSend} onPress={this.replyTask} disabled={submitting}>
              {submitting ? (
                <Spinner size="small" color="#FFFFFF" />
              ) : (
                <Text gd-icon style={styles.glyphIconSend}>{glyphSend}</Text>
              )}
            </TouchableOpacity>
          </View>
          <TimePicker
            ref={ref => { this.TimePicker = ref }}
            onCancel={() => this.onCancel()}
            onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
          />
        </Container>
      </StyleProvider>
    );
  }

  async handleDocPicker() {
    const { actions } = this.props;
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('results', results)
      const res = await actions.uploadAttachment(_.head(results))
      this.setState(oldState => ({
        ...oldState,
        attachments: [...oldState.attachments, ...res?.value]
      }))
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  setMessage(text) {
    const { errors } = this.state;
    const newErrors = {...errors};
    const message = String(text)
    if (message) delete newErrors.message;
    else newErrors.message = 1;

    this.setState({message, errors:newErrors});
  }

  selectUser(userId) {
    if (this.state.userId == userId) {
      this.openSelectUserScreen();
    } else {
      this.setState({userId, errors:{}});
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
    console.log('selectUserFromList', userId)
    this.setState({userId, errors:{}});
  }

  selectStatus(statusId) {
    if (this.state.statusId == statusId) {
      this.openSelectStatusScreen();
    } else {
      this.setState({statusId, errors:{}});
    }
  }
  openSelectStatusScreen() {
    const { task } = this.props;
    const params = {
      projectId: task.projectId,
      taskTypeId: task.taskTypeId,
      onPress: this.selectStatusFromList
    };
    if (!task.isOpen) params.showClosedStatuses = false;
    this.props.navigation.navigate('select_status', params);
  }
  selectStatusFromList(statusId) {
    this.setState({statusId, errors:{}});
  }

  replyTask() {
    console.log('replyTask');
    const { task, actions, navigation } = this.props;
    const { userId, statusId, message, submitting, attachments, reportedMinutes } = this.state;

    if (submitting) {
      console.log('already submitting');
      return;
    }

    let arUserId = userId;
    if (arUserId == AR_NO_ACTION_REQUIRED) arUserId = null;

    let errors = {};
    let userRequired = true;
    let messageRequired = true;

    const selectedStatusId = statusId;
    const selectedStatus = gd.session.statuses.get(statusId);
    const selectedSystemStatus = (selectedStatus) ? selectedStatus.systemStatus : null;

    const taskActionRequiredUserId = task.actionRequiredUserId || null;
    const selectedActionRequiredUserId = arUserId;


    console.log('selectedActionRequiredUserId', selectedActionRequiredUserId)
    console.log('taskActionRequiredUserId', taskActionRequiredUserId)
    console.log('selectedStatusId', selectedStatusId)
    console.log('task.taskStatusId', task.taskStatusId)

    // action required user
    /*if (gd.const.systemStatus.isClosed(selectedSystemStatus)) {
      // userId not needed
      userRequired = false;
    }*/

    // message
    if (
      gd.const.systemStatus.isClosed(selectedSystemStatus)
      || (selectedActionRequiredUserId != taskActionRequiredUserId)
      || (selectedStatusId != task.taskStatusId)
    ) {
      // message not needed
      messageRequired = false;
    }

    if (!userId && userRequired) errors.userId = 1;
    if (!statusId) errors.statusId = 1;
    if (!message && messageRequired) errors.message = 1;
    console.log('errors', errors);
    if (Object.keys(errors).length) {
      this.setState({errors});
      return;
    }

    const reply = {
      companyId: task.companyId,
      actionRequireUser: arUserId,
      status: statusId,
      message: String(message).replace(/^\s+|\s+$/g, ''),
      attachments,
      reportedMinutes
    };
    console.log('replyTask', reply);

    this.setState({submitting:true});

    const errorHandler = (e) => {
      this.setState({submitting:false});
      Toast.show({
        type: 'danger',
        text: 'Opps, something went wrong.',
        position: 'bottom',
        buttonText: 'Ok',
        duration: 5000
      });
      window.sentryLogger.captureException(e);
    };

    if (selectedActionRequiredUserId != taskActionRequiredUserId && !message && selectedStatusId == task.taskStatusId) {

      actions.updateTaskArUser(task, arUserId)
        .then(() => {
          navigation.goBack();
        })
        .catch((e) => {
          console.log('updateTaskArUser error', e);
          errorHandler(e);
        })

    } else {

      actions.replyTask(task, reply)
        .then(() => {
          navigation.goBack();
        })
        .catch((e) => {
          console.log('reply error', e);
          errorHandler(e);
        })
    }

  }
}

const styles = StyleSheet.create({
  title: {
    color: '#565656',
    fontSize: 13,
    fontFamily: 'OpenSans-Regular'
  },
  input: {
    color: '#030303',
    fontSize: 15,
    fontFamily: 'OpenSans-Regular'
  },
  footer: {
    height: 58 + theme.bottomSpace,
    paddingBottom: theme.bottomSpace,
    borderTopWidth: 1,
    borderTopColor: '#E9EBED',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  footerRound: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#BDBFC2',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  footerStatus: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#BDBFC2',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerBtn: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginRight: 12
  },
  timerTitle: {
    color: '#4F4F4F',
    fontSize: 12,
    paddingLeft: 6
  },
  closeIcon: {
    paddingLeft: 4,
    paddingTop: 2,
    fontSize: 16,
    color: '#4F4F4F'
  },
  statusTitle: {
    fontSize: 13,
    fontFamily: 'OpenSans-Bold'
  },
  footerSend: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4D94F1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  glyphIcon: {
    color: '#4F4F4F',
    fontSize: 18
  },
  glyphIconSend: {
    color: '#FFFFFF',
    fontSize: 18
  }
})

export default TaskReply;
