import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InteractionManager, RefreshControl, Linking } from 'react-native';
import {
  StyleProvider,
  Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import { myWorkLoad } from '../../redux/actions/my-work';
import { rootScreenChange } from '../../redux/actions/root-screen';
import { rootScreenValue } from '../../redux/constants';
import LoadingContent from '../common/loading-content';
import MyWorkFolders from './my-work-folders';
import DeepLinking from 'react-native-deep-linking';
import { loadTask } from '../../redux/actions/task';

class MyWorkScreen extends Component {
  constructor(props) {
    super(props);
    this.renderLoading = this.renderLoading.bind(this);
    this.renderMyWork = this.renderMyWork.bind(this);
    this.handleFolderPress = this.handleFolderPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.state = { splash: true };
  }
  componentDidMount() {
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({splash:false})
      });
    }, 100);
    this._checkInitialUrl()
    DeepLinking.addScheme('https://')
    Linking.addEventListener('url', this.handleUrl);
    DeepLinking.addRoute('/t/:id', this.goToTask.bind(this));
    DeepLinking.addRoute('/t/:id/', this.goToTask.bind(this));
    DeepLinking.addRoute('/p/:id', this.goToProject.bind(this));
    DeepLinking.addRoute('/p/:id/', this.goToProject.bind(this));
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleUrl);
  }
  _checkInitialUrl = async () => {
    const url = await Linking.getInitialURL()
    this.handleUrl({ url })
  }

  handleUrl({ url }) {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };
  goToTask(response) {
    const taskId = response.id
    this.props.actions.loadTask(taskId);
    this.props.navigation.navigate('task_view');
  }
  goToProject(response) {
    const projectId = response.id
    this.props.navigation.navigate('project_tasks', { projectId });
  }
  render() {
    console.log('my-work-screen render');
    const { me, myWork, navigation } = this.props;
    const { splash } = this.state;
    const showAddButton = !splash && me.id && !(myWork.isFetching || myWork.error);
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => navigation.openDrawer()}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>My work</Title>
            </Body>
            <Right>
              {showAddButton &&
              <Button transparent onPress={() => navigation.navigate('task_create')}>
                <Icon name="add" />
              </Button>}
            </Right>
          </ColorHeader>
          {this.renderLoading()}
          {this.renderMyWork()}
        </Container>
      </StyleProvider>
    );
  }

  renderLoading() {
    const { splash } = this.state;
    const { me, myWork: { isFetching, error } } = this.props;

    if (error) {
      return (
        <Content contentContainerStyle={{flex: 1, alignItems:'center', justifyContent:'center'}}
                 refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.handleRefresh} /> }>
          <Text>Oops... Something went wrong.</Text>
        </Content>
      );
    }

    if (splash) return <LoadingContent />;

    if (me.id && !isFetching) return null;

    return <LoadingContent/>;
  }
  renderMyWork() {
    if (this.state.splash) return false;

    const { me, myWork: { isFetching, error, totals } } = this.props;
    if (!me.id || isFetching || error) return null;

    return (
      <Content refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.handleRefresh} /> }>
        <MyWorkFolders totals={totals} onPress={this.handleFolderPress} />
      </Content>
    );
  }
  handleFolderPress(folder) {
    console.log('handleFolderPress', folder);
    this.props.navigation.navigate('my_work_folder', {folder});
  }
  handleRefresh() {
    this.props.actions.myWorkLoad()
      .catch(error => {
        if (error.code == 403) {
          //this.props.navigation.navigate('login');
          this.props.actions.rootScreenChange(rootScreenValue.login)
        }
      });
  }
}

function mapStateToProps(state) {
  return {
    me: state.me,
    myWork: state.myWork
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      myWorkLoad: () => dispatch(myWorkLoad()),
      rootScreenChange: screen => dispatch(rootScreenChange(screen)),
      loadTask: (taskId) => dispatch(loadTask(taskId)),
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyWorkScreen);
