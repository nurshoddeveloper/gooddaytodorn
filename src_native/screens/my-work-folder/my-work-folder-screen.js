import React, { Component } from 'react';
import { InteractionManager, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import {
  StyleProvider,
  Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text,
  Grid, Col
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import { getMyWorkTitle, getMyWorkFilterFolderName } from '../../common/utils';
import MyWorkFolder from './my-work-folder';
import { myWorkLoad } from '../../redux/actions/my-work';
import { loadTask } from '../../redux/actions/task';
import { loadEvent } from '../../redux/actions/event';
import { rootScreenChange } from '../../redux/actions/root-screen';
import { rootScreenValue } from '../../redux/constants';
import LoadingContent from '../../screens/common/loading-content';


class MyWorkFolderScreen extends Component {
  constructor(props) {
    super(props);
    this.handleTaskPress = this.handleTaskPress.bind(this);
    this.handleEventPress = this.handleEventPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.state = { splash: true }
  }
  render() {
    const { folder } = this.props.navigation.state.params;
    const { splash } = this.state;
    const { myWork } = this.props;
    console.log('MyWorkFolderScreen render folder', folder);

    const title = getMyWorkTitle(folder);
    const filterFolderName = getMyWorkFilterFolderName(folder);
    gd.session.myWork.sort(); // ? need this ?
    const items = gd.session.myWork.filterByFolderAndTypeTask(filterFolderName);

    const rc = <RefreshControl refreshing={myWork.isFetching} onRefresh={this.handleRefresh} />;

    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{title}</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.props.navigation.navigate('task_create')}>
                <Icon name="add" />
              </Button>
            </Right>
          </ColorHeader>
          {splash
            ?
              <LoadingContent />
            :
              items.length > 0
              ?
              <Content refreshControl={rc}>
                <MyWorkFolder items={items} onTaskPress={this.handleTaskPress} onEventPress={this.handleEventPress} />
              </Content>
              :
              <Content refreshControl={rc}
                       contentContainerStyle={{flex: 1, alignItems:'center', justifyContent:'center'}}>
                <Text>No open tasks found.</Text>
              </Content>
          }
        </Container>
      </StyleProvider>
    );
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      gd.session.me.registerVisitMyWork();
      this.setState({splash:false})
    });
  }
  handleTaskPress(taskId) {
    console.log('handleTaskPress', taskId);
    this.props.actions.loadTask(taskId);
    this.props.navigation.navigate('task_view');
  }
  handleEventPress(eventId) {
    console.log('handleEventPress', eventId);
    this.props.actions.loadEvent(eventId);
    this.props.navigation.navigate('event_view');
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
    myWork: state.myWork
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      myWorkLoad: () => dispatch(myWorkLoad()),
      rootScreenChange: screen => dispatch(rootScreenChange(screen)),
      loadTask: (taskId) => dispatch(loadTask(taskId)),
      loadEvent: (eventId) => dispatch(loadEvent(eventId))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyWorkFolderScreen);
