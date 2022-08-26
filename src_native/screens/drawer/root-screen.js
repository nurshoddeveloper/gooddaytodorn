import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rootScreenValue } from '../../redux/constants';
import { rootScreenChange } from '../../redux/actions/root-screen';
import MyWorkScreen from '../my-work/my-work-screen';
import LoginScreen from '../login/login-screen';
import ProjectTasksScreen from '../project-tasks/project-tasks-screen';
import ActivityStreamScreen from '../activity-stream/activity-stream-screen';
import FavoritesScreen from '../favorites/favorites-screen';
import SearchScreen from '../search/search-screen';
import TaskCreateScreen from '../task-create/task-create-screen';
import EventsScreen from '../events/events-screen';
import SettingsScreen from '../settings/settings-screen';
import fcmController from '../../firebase-cloud-messaging/fcm-controller';


class RootScreen extends Component {
  render() {
    const { rootScreen: { screen }, navigation, actions } = this.props;

    let Comp = MyWorkScreen;
    switch (screen) {
      case rootScreenValue.login:
        navigation.goBack = () => actions.rootScreenChange(rootScreenValue.my_work); // dirty trick
        Comp = LoginScreen;
        break;
      case rootScreenValue.project_tasks:
        Comp = ProjectTasksScreen;
        break;
      case rootScreenValue.activity_stream:
        Comp = ActivityStreamScreen;
        break;
      case rootScreenValue.favorites:
        Comp = FavoritesScreen;
        break;
      case rootScreenValue.search:
        Comp = SearchScreen;
        break;
      case rootScreenValue.task_create:
        navigation.goBack = () => actions.rootScreenChange(rootScreenValue.my_work); // dirty trick
        Comp = TaskCreateScreen;
        break;
      case rootScreenValue.events:
        Comp = EventsScreen;
        break;
      case rootScreenValue.settings:
        Comp = SettingsScreen;
        break;
    }

    return <Comp navigation={navigation} fromDrawer />
  }

  componentDidMount() {
    fcmController.setNavigation(this.props.navigation);
  }
}

function mapStateToProps(state) {
  return {
    rootScreen: state.rootScreen,
    me: state.me
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      rootScreenChange: (screen) => dispatch(rootScreenChange(screen))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootScreen);
