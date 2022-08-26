import React from 'react';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon, Text,
  ListItem
} from 'native-base';
import { FlatList } from 'react-native';
import getTheme from '../../../app-theme/components';
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import UserIcon from '../../../components/icon/user-icon';


export default class EventSelectUserScreen extends React.PureComponent {

  _keyExtractor = (user, index) =>  user.id;

  _renderItem = ({item}) => {
    const { navigation } = this.props;
    const { onPress, userId } = navigation.state.params;
    return (
      <ListItem gd-list-item selected={item.id == userId} button={true} onPress={() => { onPress(item.id); navigation.goBack(); }}>
        <Left>
          <UserIcon user={item}/>
        </Left>
        <Body>
          <Text>{item.name}</Text>
        </Body>
      </ListItem>
    )
  };

  render() {
    const { navigation } = this.props;
    const { event } = navigation.state.params;

    const eventProject = event.project ? event.project : gd.session.projects.get(event.projectId);
    const eventUsers = gd.session.projectUsers.filterByProject(eventProject.id).map(pu=>pu.user);

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
              <Title>Select user</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <FlatList
              data={eventUsers}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
