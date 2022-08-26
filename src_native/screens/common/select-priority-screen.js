import React from 'react';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon, Text,
  ListItem
} from 'native-base';
import { FlatList } from 'react-native';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import TaskPriorityIcon from '../../components/icon/task-priority-icon';


export default class SelectPriorityScreen extends React.PureComponent {

  _keyExtractor = (item, index) =>  'key_' + item.value;

  _renderItem = ({item}) => {
    const { navigation } = this.props;
    const { onPress } = navigation.state.params;
    return (
      <ListItem gd-list-item button={true} onPress={() => { onPress(item.value); navigation.goBack(); }}>
        <Left>
          <TaskPriorityIcon priority={item.value} />
        </Left>
        <Body>
          <Text>{item.label}</Text>
        </Body>
      </ListItem>
    )
  };

  render() {
    const { navigation } = this.props;
    const { companyId } = navigation.state.params;

    const priorityOptions = gd.session.companies.get(companyId).priorities.exportToOptions();
    let filtered = [];
    priorityOptions.map(p => {
      if (p.value > 10) return;
      filtered.push(p);
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
              <Title>Select priority</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <FlatList
              data={filtered}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
