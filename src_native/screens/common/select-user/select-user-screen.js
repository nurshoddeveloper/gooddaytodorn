import React, { Component } from 'react';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon, Text,
  Input, Item,
  Grid, Row
} from 'native-base';
import { InteractionManager } from 'react-native';
import getTheme from '../../../app-theme/components';
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import { createNoArUser } from '../../../common/utils';
import UsersList from './users-list';

export default class SelectUserScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { query: '', splash: true };
    this.setQuery = this.setQuery.bind(this);
    this.search = this.search.bind(this);
    this.androidClearInput = this.androidClearInput.bind(this);
    this.renderResult = this.renderResult.bind(this);
    this.handleUserPress = this.handleUserPress.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ splash: false })
    });
  }

  render() {
    const { query } = this.state;
    const { navigation } = this.props;
    const showAndroidClear = theme.platform === 'android' && query.length > 0;

    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader searchBar rounded>
            <Grid>
              <Row>
                <Left>
                  <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" />
                  </Button>
                </Left>
                <Body>
                  <Title>Select user</Title>
                </Body>
                <Right />
              </Row>
              <Row style={{ paddingBottom: 10, paddingRight: 1 }}>
                <Item>
                  <Icon name="md-search" />
                  <Input placeholder="Search"
                    defaultValue={query}
                    clearButtonMode="unless-editing"
                    onChangeText={this.setQuery}
                    onEndEditing={this.search}
                  />
                  {showAndroidClear && <Icon name="md-close" onPress={this.androidClearInput} />}
                </Item>
              </Row>
            </Grid>
          </ColorHeader>
          {this.renderResult()}
        </Container>
      </StyleProvider>
    )
  }

  renderResult() {
    const { navigation } = this.props;
    const { companyId, projectId, task, createTaskMode, onlyTaskUsers } = navigation.state.params;
    const { query } = this.state;
    // find all task users
    let taskUsers = [];
    if (task) taskUsers = task.users.map(tu => gd.session.users.get(tu.userId));
    taskUsers.unshift(createNoArUser(createTaskMode));
    const arrTaskUsers = taskUsers.map(u => u.id);
    // find all project users
    let projectUsers = gd.session.projectUsers.filterByProject(projectId).map(pu => pu.user).filter(u => arrTaskUsers.indexOf(u.id) == -1);
    const arrProjectUsers = projectUsers.map(u => u.id);

    // find other company users
    let companyUsers = gd.session.companyUsers.filterByCompany(companyId).map(cu => cu.user).filter(u => arrProjectUsers.indexOf(u.id) == -1 && arrTaskUsers.indexOf(u.id) == -1);

    // filter
    if (query.length > 0) {
      const lcQuery = query.toLowerCase();
      taskUsers = taskUsers.filter(u => u.name.toLowerCase().indexOf(lcQuery) > - 1);
      projectUsers = projectUsers.filter(u => u.name.toLowerCase().indexOf(lcQuery) > - 1);
      companyUsers = companyUsers.filter(u => u.name.toLowerCase().indexOf(lcQuery) > - 1);
    }

    const sections = [];
    if (taskUsers.length) sections.push({ data: taskUsers, title: 'Task users' });
    if (onlyTaskUsers === undefined) {
      if (projectUsers.length) sections.push({ data: projectUsers, title: 'Project users' });
      if (companyUsers.length) sections.push({ data: companyUsers, title: 'Organization users' });
    }
    if (sections.length == 0) {
      return (
        <Content contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Nothing found.</Text>
        </Content>
      )
    }


    return (
      <Content>
        <UsersList sections={sections} onPress={this.handleUserPress} />
      </Content>
    )
  }

  setQuery(text) {
    const query = String(text).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    console.log('setQuery', query, 'length', query.length);
    if (this.state.query !== query) this.setState({ query });
  }

  search() {
    //const query = this.state.query;
    //console.log('search', query);
  }

  androidClearInput() {
    this.setState({ query: '' });
  }

  handleUserPress(userId) {
    const { navigation } = this.props;
    const { onPress } = navigation.state.params;
    console.log('handleUserPress', userId);
    onPress(userId);
    navigation.goBack();
  }
}