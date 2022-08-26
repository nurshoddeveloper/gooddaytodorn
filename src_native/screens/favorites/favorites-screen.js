import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InteractionManager, RefreshControl } from 'react-native';
import {
  StyleProvider, Container, Header, Title, Content, View,
  Body, Left, Right,
  Icon, Text, Button
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../common/loading-content';
import { loadTask } from '../../redux/actions/task';
import { loadFavorites } from '../../redux/actions/favorites';
import FavoritesList from './list/favorites-list';


class FavoritesScreen extends Component {
  constructor(props) {
    super(props);
    this.renderResult = this.renderResult.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleProjectPress = this.handleProjectPress.bind(this);
    this.handleTaskPress = this.handleTaskPress.bind(this);
    this.state = { splash: true };
  }
  componentDidMount() {
    const { favorites, actions } = this.props;
    if (!favorites.isFetching
      && !favorites.error
      && (!favorites.tasks || favorites.tasks.length == 0)
      && (!favorites.projects || favorites.projects.length == 0)
    ) {
      actions.loadFavorites();
    }
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({splash:false})
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
              <Title>Favorites</Title>
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
    const { favorites: { isFetching, error, tasks, projects } } = this.props;

    const rc = <RefreshControl refreshing={isFetching} onRefresh={this.handleRefresh} />;

    if (error) {
      return (
        <Content contentContainerStyle={{flex:1, alignItems:'center', justifyContent:'center'}}
                 refreshControl={rc}
        >
          <Text>Oops... Something went wrong.</Text>
        </Content>
      )
    }

    if (splash || isFetching) return <LoadingContent />;

    const sections = [];
    if (projects && projects.length) {
      projects.map(p => {
        p.type = 'project';
      });
      sections.push({data: projects, title: 'Projects'});
    }
    if (tasks && tasks.length) {
      tasks.map(t => {
        t.type = 'task';
      });
      sections.push({data: tasks, title: 'Tasks'});
    }

    if (sections.length < 1) {
      return (
        <Content contentContainerStyle={{flex:1, alignItems:'center', justifyContent:'center'}}
                 refreshControl={rc}
        >
          <Text>Nothing found.</Text>
        </Content>
      )
    }

    return (
      <Content refreshControl={rc}>
        <FavoritesList sections={sections} onProject={this.handleProjectPress} onTask={this.handleTaskPress} />
      </Content>
    );
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
  handleRefresh() {
    this.props.actions.loadFavorites();
  }
}


function mapStateToProps(state) {
  return {
    favorites: state.favorites
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadTask: taskId => dispatch(loadTask(taskId)),
      loadFavorites: () => dispatch(loadFavorites()),
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritesScreen);