import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findNodeHandle } from 'react-native';
import {
  StyleProvider, Container, Header, Title, Content,
  Body, Left, Right,
  Icon, Text, Button, Input, Spinner,
  List, ListItem, Item,
  Grid, Row,
  Toast
} from 'native-base';
import { TouchableOpacity } from 'react-native'
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import SelectProject from '../../components/select-project';
import SelectUser from '../../components/select-user';
import SelectType from '../../components/select-type';
import { createTask } from '../../redux/actions/task';
import { AR_NO_ACTION_REQUIRED } from '../../common/constants';
import UserIcon from '../../components/icon/user-icon';


const styleSelect = { paddingLeft: theme.listItemPadding, paddingTop: 3 };
const styleMessage = { paddingLeft: theme.listItemPadding - 2 };
const styleError = { paddingLeft: theme.listItemPadding, paddingTop: 5 };
const styleRowRoundBtn = { paddingTop: 21 };


class TaskCreateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      userId: null,
      typeId: null,
      title: null,
      message: null,
      errors: {},
      submitting: false,
    };
    this.selectProject = this.selectProject.bind(this);
    this.selectProjectFromList = this.selectProjectFromList.bind(this);
    this.selectUser = this.selectUser.bind(this);
    this.selectUserFromList = this.selectUserFromList.bind(this);
    this.selectType = this.selectType.bind(this);
    this.selectTypeFromList = this.selectTypeFromList.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.openSelectProjectScreen = this.openSelectProjectScreen.bind(this);
    this.openSelectUserScreen = this.openSelectUserScreen.bind(this);
    this.openSelectTypeScreen = this.openSelectTypeScreen.bind(this);
    this.scrollToInputWithOffset = this.scrollToInputWithOffset.bind(this);
    this.createTask = this.createTask.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const { navigation } = props;
    console.log(props, 'sdfgtdfsg')
    if (navigation.state.params && navigation.state.params.projectId
      && navigation.state.params.projectId != state.projectId
    ) {
      return { projectId: navigation.state.params.projectId };
    }
    return null;
  }
  render() {
    const { projectId, userId, typeId, errors, submitting } = this.state;
    const { fromDrawer } = this.props;
    const navParams = this.props.navigation.state.params;
    let lmbIcon = 'arrow-back';
    let lmbFunc = () => this.props.navigation.goBack();
    if ((navParams && navParams.fromDrawer) || fromDrawer) {
      lmbIcon = 'menu';
      lmbFunc = () => this.props.navigation.openDrawer();
    }
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={lmbFunc}>
                <Icon name={lmbIcon} />
              </Button>
            </Left>
            <Body>
              <Title>New task</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content ref={(c) => this._content = c}>
            <List>
              <ListItem>
                <Body>
                  <Grid>
                    <Row><Text note>Project</Text></Row>
                    <Row style={styleSelect}>
                      {projectId ?
                        <SelectProject onPress={this.selectProject} projectId={projectId} />
                        :
                        <Button transparent dark onPress={this.openSelectProjectScreen} style={{ flex: 1 }}>
                          <Text uppercase={false} numberOfLines={1} style={{ paddingLeft: 0, fontSize: 16, lineHeight: 20 }}>Select project</Text>
                        </Button>
                      }
                    </Row>
                  </Grid>
                </Body>
                <Right style={styleRowRoundBtn}>
                  <Button gd-button-round-more onPress={this.openSelectProjectScreen}>
                    <Icon name="ios-more" />
                  </Button>
                </Right>
              </ListItem>
              {projectId &&
                <ListItem>
                  <Body>
                    <Grid>
                      <Row><Text note>User</Text></Row>
                      {userId ?
                        <Row style={styleSelect}>
                          <SelectUser onPress={this.selectUser} projectId={projectId} userId={userId} createTaskMode />
                        </Row> :
                        <TouchableOpacity onPress={this.selectUser}>
                          <Row>
                            <Text>Select user</Text>
                          </Row>
                        </TouchableOpacity>}
                      {errors.userId &&
                        <Row style={styleError}><Item error-create-task><Text>Please select user</Text></Item></Row>
                      }
                    </Grid>
                  </Body>
                  <Right style={styleRowRoundBtn}>
                    <Button gd-button-round-more onPress={this.openSelectUserScreen}>
                      <Icon name="ios-more" />
                    </Button>
                    {errors.userId &&
                      <Row style={styleError}><Item error-create-task><Text>&nbsp;</Text></Item></Row>
                    }
                  </Right>
                </ListItem>
              }
              {projectId &&
                <ListItem>
                  <Body>
                    <Grid>
                      <Row><Text note>Type</Text></Row>
                      {typeId ?
                        <Row style={styleSelect}>
                          <SelectType onPress={this.selectType} projectId={projectId} typeId={typeId} />
                        </Row> :
                        <TouchableOpacity onPress={this.selectType}>
                          <Row>
                            <Text>Task Type</Text>
                          </Row>
                        </TouchableOpacity>
                      }
                      {errors.typeId &&
                        <Row style={styleError}><Item error-create-task><Text>Please select type</Text></Item></Row>
                      }
                    </Grid>
                  </Body>
                  <Right style={styleRowRoundBtn}>
                    <Button gd-button-round-more onPress={this.openSelectTypeScreen}>
                      <Icon name="ios-more" />
                    </Button>
                    {errors.typeId &&
                      <Row style={styleError}><Item error-create-task><Text>&nbsp;</Text></Item></Row>
                    }
                  </Right>
                </ListItem>
              }
              {projectId &&
                <ListItem>
                  <Body>
                    <Grid>
                      <Row style={styleMessage} scrollEnabled={true}>
                        <Input ref="message" placeholder="Task description" multiline={true} numberOfLines={5} style={{ height: 104 }} maxHeight={104}
                          onFocus={(event) => {
                            this.scrollToInputSimple(findNodeHandle(event.target));
                            //this.scrollToInputWithOffset('message')
                          }}
                          onChangeText={this.setMessage}
                        //onEndEditing={this.createTask}
                        />
                      </Row>
                      {errors.message &&
                        <Row style={styleError}><Item error-create-task><Text>Please add task description</Text></Item></Row>
                      }
                    </Grid>
                  </Body>
                </ListItem>
              }
              {projectId &&
                <ListItem noBorder>
                  <Body style={{ paddingLeft: theme.listItemPadding, justifyContent: 'center' }}>
                    <Button block onPress={this.createTask} disabled={submitting}>
                      {submitting && <Spinner color={theme.spinnerColor} />}
                      <Text>Create task</Text>
                    </Button>
                  </Body>
                </ListItem>
              }
            </List>
          </Content>
        </Container>
      </StyleProvider>
    );
  }

  selectProject(projectId) {
    console.log('selectProject', projectId);
    if (this.state.projectId == projectId) {
      this.openSelectProjectScreen();
    } else {
      this.setState({ projectId, userId: null, typeId: null, errors: {} });
    }
  }
  openSelectProjectScreen() {
    const { projectId } = this.state;
    this.props.navigation.navigate('select_project', { projectId, onPress: this.selectProjectFromList });
  }
  selectProjectFromList(projectId) {
    this.setState({ projectId, userId: null, typeId: null, errors: {} });
  }

  selectUser(userId) {
    console.log('selectUser', userId);
    if (this.state.userId === userId || this.state.userId === null) {
      this.openSelectUserScreen();
    } else {
      this.setState({ userId, errors: {} });
    }
  }
  openSelectUserScreen() {
    const { projectId, userId } = this.state;
    const companyId = gd.session.projects.get(projectId).companyId;
    this.props.navigation.navigate('select_user', { companyId, projectId, userId, onPress: this.selectUserFromList, createTaskMode: true });
  }
  selectUserFromList(userId) {
    this.setState({ userId, errors: {} });
  }

  selectType(typeId) {
    console.log('selectType', typeId);
    if (this.state.typeId == typeId || this.state.typeId == null) {
      this.openSelectTypeScreen();
    } else {
      this.setState({ typeId, errors: {} });
    }
  }
  openSelectTypeScreen() {
    const { projectId, typeId } = this.state;
    this.props.navigation.navigate('select_type', { projectId, typeId, onPress: this.selectTypeFromList });
  }
  selectTypeFromList(typeId) {
    this.setState({ typeId, errors: {} });
  }
  setMessage(text) {
    const { errors } = this.state;
    const newErrors = { ...errors };
    const message = String(text).replace(/^\s+|\s+$/g, '');
    const title = message.split('\n')[0].substring(0, 80);
    if (message) delete newErrors.message;
    else newErrors.message = 1;

    this.setState({ title, message, errors: newErrors });
  }

  createTask() {
    console.log('createTask');
    const { projectId, userId, typeId, title, message, submitting } = this.state;

    if (submitting) {
      console.log('already submitting');
      return;
    }

    let errors = {};
    if (!userId) errors.userId = 1;
    if (!typeId) errors.typeId = 1;
    if (!message) errors.message = 1;
    console.log('errors', errors);
    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    let arUserId = userId;
    if (arUserId == AR_NO_ACTION_REQUIRED) arUserId = null;

    const companyId = gd.session.projects.get(projectId).companyId;
    const task = {
      companyId,
      project: projectId,
      user: arUserId,
      type: typeId,
      title,
      message
    };
    console.log('createTask', task);

    const { navigation } = this.props;

    this.setState({ submitting: true });

    this.props.actions.createTask(task)
      .then(() => navigation.goBack())
      .catch((e) => {
        //console.log('e', e);
        this.setState({ submitting: false });
        Toast.show({
          type: 'danger',
          text: 'Opps, something went wrong.',
          position: 'bottom',
          buttonText: 'Ok',
          duration: 5000
        });
        window.sentryLogger.captureException(e);
      })
  }

  scrollToInputSimple(reactNode) {
    // Add a 'scroll' ref to your ScrollView
    //console.log('_scrollToInput', reactNode);
    //console.log('_scrollToInput', typeof this._content._root, Object.getOwnPropertyNames(this._content._root));
    //console.log('_scrollToInput', Object.getOwnPropertyNames(this._content._root.props));
    this._content._root.scrollToFocusedInput(reactNode);

  }
  scrollToInputWithOffset(refName) {
    //console.log('this.refs', Object.getOwnPropertyNames(this.refs));
    //return;
    this.refs[refName]._root.measure((fx, fy, width, height, px, py) => {

      /*console.log('Component width is: ' + width);
       console.log('Component height is: ' + height);
       console.log('X offset to frame: ' + fx);
       console.log('Y offset to frame: ' + fy);
       console.log('X offset to page: ' + px);
       console.log('Y offset to page: ' + py);*/
      const scrollTo = py;
      //console.log('scrollTo', scrollTo);
      setTimeout(() => {
        this._content._root.scrollToPosition(0, scrollTo);
        //console.log('scroll end 1');
      }, 200);
      //console.log('scroll end');
    });
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      createTask: (task) => dispatch(createTask(task))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(TaskCreateScreen);