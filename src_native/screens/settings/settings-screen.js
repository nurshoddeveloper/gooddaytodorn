import React, { Component } from 'react';
import { InteractionManager, Switch, Platform, Linking, TouchableOpacity } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {
  StyleProvider, Container, Header, Title, Content, View,
  Body, Left, Right,
  Icon, Text, Button,
  List, ListItem
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../common/loading-content';
import fcmController from '../../firebase-cloud-messaging/fcm-controller';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      splash: true,
      notifications: false
    };
    this.renderSettings = this.renderSettings.bind(this);
    this.onToggleNotifications = this.onToggleNotifications.bind(this);
    this.onToggleNotificationsLabel = this.onToggleNotificationsLabel.bind(this);
    this.openSystemSettings = this.openSystemSettings.bind(this);
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({splash: false, notifications: window.nativeAppUserAllowedNotifications})
    });
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
              <Title>Settings</Title>
            </Body>
            <Right />
          </ColorHeader>
          {this.renderSettings()}
        </Container>
      </StyleProvider>
    );
  }
  renderSettings() {
    const { splash, error, notifications } = this.state;

    if (error) {
      return (
        <Content contentContainerStyle={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <Text>Oops... Something went wrong.</Text>
        </Content>
      )
    }

    if (splash) return <LoadingContent/>;

    return (
      <Content>
        <List>
          <View style={{marginLeft:15, marginTop:15}}>
            <Text note>Notifications</Text>
          </View>
          <ListItem settingsNotificationListItem>
            <Body>
                <Text onPress={this.onToggleNotificationsLabel}>
                  Allow notifications
                </Text>
            </Body>
            <Right>
              <Switch value={notifications} onValueChange={this.onToggleNotifications} />
            </Right>
          </ListItem>
        </List>
        <TouchableOpacity style={{marginVertical:15, marginHorizontal:15}} onPress={this.openSystemSettings}>
          <Text style={{color: '#a7a7a7'}}>Please make sure notifications are allowed in </Text>
          <Text style={{color: theme.brandPrimary, textDecorationLine: 'underline', textDecorationColor: theme.brandPrimary}}>Application system settings</Text>
        </TouchableOpacity>
      </Content>
    )
  }

  onToggleNotifications(val) {
    console.log('onToggleNotifications', val);
    this.setState({notifications: val});

    fcmController.userChangedNotificationSettings(val);
  }

  onToggleNotificationsLabel() {
    const { notifications } = this.state;
    console.log('onToggleNotificationsLabel', notifications);
    this.setState({notifications: !notifications});
  }

  openSystemSettings() {
    console.log('openSystemSettings');
    if (Platform.OS === 'android') {
      if (Platform.Version >= 22) AndroidOpenSettings.appNotificationSettings();
      else AndroidOpenSettings.appDetailsSettings();
      //AndroidOpenSettings.appDetailsSettings();
      //AndroidOpenSettings.applicationSettings();
    } else {
      const url = 'app-settings://notification/myapp';
      Linking.canOpenURL(url).then(() => {
        Linking.openURL(url);
      })

    }
  }
}
