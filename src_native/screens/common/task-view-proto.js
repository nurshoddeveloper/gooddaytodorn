import React, { Component } from 'react';
import {
  StyleProvider, Container, Header, Title, Content, View,
  Body, Left, Right,
  Icon, Text, Button
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../common/loading-content';


export default class TaskViewProtoScreen extends Component {
  constructor(props) {
    super(props);
    this.renderLoading = this.renderLoading.bind(this);
    this.renderError = this.renderError.bind(this);
    this.renderTask = this.renderTask.bind(this);
  }
  render() {
    const { isFetching, error, task } = this.props.task;

    let render = this.renderLoading;
    if (isFetching) render = this.renderLoading;
    else if (error) render = this.renderError;
    else if (task) render = this.renderTask;

    return render();
  }
  renderLoading() {
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
              <Title>Task view</Title>
            </Body>
            <Right />
          </ColorHeader>
          <LoadingContent />
        </Container>
      </StyleProvider>
    );
  }
  renderError() {
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
              <Title>Task view</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content style={{padding: 20}} contentContainerStyle={{flexDirection: 'column', alignItems:'center'}}>
            <Text style={{fontSize: 30, color: theme.textGrayColor}}>404</Text>
            <Text style={{marginTop:10, color: theme.textGrayColor, textAlign:'center'}}>The requested task is not found or you have no access.</Text>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
  renderTask() {
    return null;
  }
}


