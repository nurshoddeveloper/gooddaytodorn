import React, { Component } from 'react';
import { connect } from 'react-redux';
import {InteractionManager, RefreshControl } from 'react-native';
import {
  StyleProvider, Container, Header, Title, Content, View,
  Body, Left, Right,
  Icon, Text, Button,
  List, ListItem
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../common/loading-content';
import ActivityList from './list/activity-list';
import { loadTask } from '../../redux/actions/task';
import { loadEvent } from '../../redux/actions/event';
import { loadActivityStream } from '../../redux/actions/activity-stream';


class ActivityStreamScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      splash: true,
    };
    this.renderResult = this.renderResult.bind(this);
    this.handleProjectPress = this.handleProjectPress.bind(this);
    this.handleTaskPress = this.handleTaskPress.bind(this);
    this.handleEventPress = this.handleEventPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }
  componentDidMount() {
    const { activityStream, actions } = this.props;
    if (!activityStream.isFetching
      && !activityStream.error
      && (!activityStream.activities || activityStream.activities.length == 0)
    ) {
      actions.loadActivityStream();
    }
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({splash: false})
      });
    }, 50);
  }
  render() {
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Activity stream</Title>
            </Body>
            <Right />
          </ColorHeader>
          {this.renderResult()}
        </Container>
      </StyleProvider>
    );
  }
  renderResult() {
    const { splash } = this.state;
    const { activityStream: { isFetching, error, activities } } = this.props;

    const rc = <RefreshControl refreshing={isFetching} onRefresh={this.handleRefresh} />;

    if (error) {
      return (
        <Content refreshControl={rc} contentContainerStyle={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text>Oops... Something went wrong.</Text>
        </Content>
      )
    }

    if (splash || isFetching) return <LoadingContent />;

    if (activities.length < 1) {
      return (
        <Content refreshControl={rc} contentContainerStyle={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text>Nothing found.</Text>
        </Content>
      )
    }

    return (
      <Content refreshControl={rc}>
        <ActivityList activities={activities} onProject={this.handleProjectPress} onTask={this.handleTaskPress} onEvent={this.handleEventPress} />
      </Content>
    )
  }
  handleProjectPress(projectId) {
    console.log('handleProjectPress', projectId);
    this.props.navigation.navigate('project_tasks', { projectId });
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
    this.props.actions.loadActivityStream();
  }
}


function mapStateToProps(state) {
  return {
    activityStream: state.activityStream
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadTask: taskId => dispatch(loadTask(taskId)),
      loadEvent: eventId => dispatch(loadEvent(eventId)),
      loadActivityStream: () => dispatch(loadActivityStream()),
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityStreamScreen);
