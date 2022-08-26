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
import { getColorById } from '../../../common/status-colors';


const statuses = [
  {
    id: 'pending',
    value: 'pending',
    label: 'Pending',
    color: 2,
    systemStatus: 1
  },
  {
    id: 'accomplished',
    value: 'accomplished',
    label: 'Accomplished',
    color: 11,
    systemStatus: 5
  },
];

export default class EventSelectStatusScreen extends React.PureComponent {

  _keyExtractor = (item, index) =>  item.id;

  _renderItem = ({item}) => {
    const { navigation } = this.props;
    const { onPress } = navigation.state.params;
    const status = item;
    const bgColor = getColorById(status.color);
    return (
      <ListItem style={{paddingRight: theme.listItemPadding}}>
        <Body style={{paddingLeft: theme.listItemPadding, paddingRight:0}}>
          <Button block style={{backgroundColor: bgColor}} onPress={() => { onPress(status.id); navigation.goBack(); }}>
            <Text>{status.label}</Text>
          </Button>
        </Body>
      </ListItem>
    )
  };

  render() {
    const { navigation } = this.props;

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
