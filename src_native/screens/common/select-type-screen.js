import React from 'react';
import _ from 'lodash';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon, Text,
  ListItem
} from 'native-base';
import { FlatList } from 'react-native';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import TaskTypeIcon from '../../components/icon/task-type-icon';
import StructureControl from '../../../src_web/src/core/gd/structure-control/structure-control';


export default class SelectTypeScreen extends React.PureComponent {

  _keyExtractor = (item, index) =>  item.value;

  _renderItem = ({item}) => {
    const { navigation } = this.props;
    const { typeId, onPress } = navigation.state.params;
    return (
      <ListItem gd-list-item selected={item.value == typeId} button={true} onPress={() => { onPress(item.value); navigation.goBack(); }}>
        <Left>
          <TaskTypeIcon taskType={item} selected={item.value == typeId} />
        </Left>
        <Body>
          <Text>{item.label}</Text>
        </Body>
      </ListItem>
    )
  };

  render() {
    const { navigation } = this.props;
    const { projectId } = navigation.state.params;

    let taskTypes = [];
    let companyId = null;

    const project = gd.session.projects.get(projectId);
    if (project) companyId = project.companyId;

    if (companyId) {
      const allTaskTypesOptions = gd.session.taskTypes.filterByCompany(companyId).exportOptions();
      taskTypes = _.orderBy(
        StructureControl.getTaskTypes(projectId, {exportToOptions: true}),
        [o => _.findIndex(allTaskTypesOptions, to => to.value === o.value)],
        ['asc']
      );
    }

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
              <Title>Select task type</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <FlatList
              data={taskTypes}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
