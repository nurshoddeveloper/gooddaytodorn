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


export default class SelectOneItemScreen extends React.PureComponent {

  _keyExtractor = (item) =>  'key_' + item.id;

  _renderItem = ({item}) => {
    const { navigation } = this.props;
    const { onPress, selectedId } = navigation.state.params;
    return (
      <ListItem gd-list-item selected={item.id == selectedId} button={true} onPress={() => { onPress(item.id); navigation.goBack(); }}>
        <Left />
        <Body>
          <Text>{item.name}</Text>
        </Body>
      </ListItem>
    )
  };

  render() {
    const { navigation } = this.props;
    const { title, items } = navigation.state.params;

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
              <Title>{title}</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <FlatList
              data={items}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
