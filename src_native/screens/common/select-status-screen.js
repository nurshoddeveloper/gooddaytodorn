import React from 'react';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon, Text,
  ListItem
} from 'native-base';
import _ from 'lodash';
import { FlatList } from 'react-native';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import { getColorById } from '../../common/status-colors';
import TaskStatusManager from '../../../src_web/src/core/gd/manager/task-status-manager';


export default class SelectStatusScreen extends React.PureComponent {

  _keyExtractor = item => item.id;

  _renderItem = ({item}) => {
    const { navigation } = this.props;
    const { onPress } = navigation.state.params;
    const status = item;
    console.log(status,'staus props')
    const bgColor = getColorById(status.color);
    return (
      <ListItem style={{paddingRight: theme.listItemPadding}}>
        <Body style={{paddingLeft: theme.listItemPadding, paddingRight:0}}>
          <Button block style={{backgroundColor: bgColor}} onPress={() => { onPress(status.id); navigation.goBack(); }}>
            <Text>{status.name}</Text>
          </Button>
        </Body>
      </ListItem>
    )
  };

  render() {
    const { navigation } = this.props;
    const { projectId, taskTypeId, showClosedStatuses } = navigation.state.params;

    let taskStatuses = TaskStatusManager.getTaskStatuses({projectId, taskTypeId});
    if (showClosedStatuses === false) {
      taskStatuses = _.filter(taskStatuses, ts => ts.systemStatus < 5);
    }

    const grouped = _.chain(taskStatuses)
      .orderBy(m => m.systemStatus, 'asc')
      .groupBy(m => {
        switch (m.systemStatus){
          case 1:
            return 'new';
          case 2:
          case 3:
            return 'in-progress';
        }
        return 'closed';
      })
      .toPairs()
      .value();

    const statuses = [];

    grouped.forEach(g => {
      g[1].forEach(taskStatus => {
        statuses.push(taskStatus.serialize());
      })
    });

    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Select status</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <FlatList
              data={statuses}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
