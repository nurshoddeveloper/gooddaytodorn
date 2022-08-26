import React from 'react';
import { connect } from 'react-redux';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View, Image, Linking } from 'react-native';
import {
  StyleProvider,
  Container, Content,
  Text, Button, Icon,
  Footer,
  Grid, Row, Col
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
//import logoSrc from '../../../assets/custom-84x84.png';
import logoSrc from '../../../assets/images/sidebar-72x72.png';
import { logout } from '../../redux/actions/auth';
import { rootScreenChange } from '../../redux/actions/root-screen';
import { rootScreenValue } from '../../redux/constants';
import appInfo from '../../../package.json';
import UserIcon from '../../components/icon/user-icon';
import { drawerWidth } from './drawer-width';


function sidebar(props) {
  const { me, actions, navigation, activeScreen } = props;
  const fullWidth = drawerWidth();
  // iconUserWidth + iconUserMarginLeft + emailMarginLeft + logoutButtonWidth
  const emailWidth = fullWidth - (36+17) - 8 - 93;
  const sbh = getStatusBarHeight(true);

  const addMyWork = {};
  const addProjects = {};
  const addActivityStream = {};
  const addEvents = {};
  const addFavorites = {};
  const addSearch = {};
  const addNewTask = {};
  const addSettings = {};
  switch (activeScreen) {
    case rootScreenValue.my_work:
      addMyWork['sidebar-button-active'] = true;
      break;
    case rootScreenValue.project_tasks:
      addProjects['sidebar-button-active'] = true;
      break;
    case rootScreenValue.activity_stream:
      addActivityStream['sidebar-button-active'] = true;
      break;
    case rootScreenValue.events:
      addEvents['sidebar-button-active'] = true;
      break;
    case rootScreenValue.favorites:
      addFavorites['sidebar-button-active'] = true;
      break;
    case rootScreenValue.search:
      addSearch['sidebar-button-active'] = true;
      break;
    case rootScreenValue.task_create:
      addNewTask['sidebar-button-active'] = true;
      break;
    case rootScreenValue.settings:
      addSettings['sidebar-button-active'] = true;
      break;
  }

  return (
    <StyleProvider style={getTheme(theme)}>
      <Container>
        <Content scrollEnabled={true} style={{backgroundColor: '#2E4451'}}>

          <View style={{height: 19 + sbh}} />

          {me && me.id &&
          <View>

            <Button sidebar-button {...addMyWork}
                    onPress={() => {
                      navigation.closeDrawer();
                      setTimeout(() => {
                        actions.rootScreenChange(rootScreenValue.my_work)
                      }, 100);
                    }}>
              <Icon name="md-checkbox"/>
              <Text uppercase={false}>My work</Text>
            </Button>

            <View style={{height: 5}}/>


            <Button sidebar-button {...addProjects}
                    onPress={() => {
                      navigation.closeDrawer();
                      setTimeout(() => {
                        actions.rootScreenChange(rootScreenValue.project_tasks)
                      }, 100);
                    }}
            >
              <Icon name="logo-buffer"/>
              <Text uppercase={false}>Projects</Text>
            </Button>

            <View style={{height: 5}}/>

            <Button sidebar-button {...addActivityStream}
                    onPress={() => {
                      navigation.closeDrawer();
                      setTimeout(() => {
                        actions.rootScreenChange(rootScreenValue.activity_stream)
                      }, 100);
                    }}
            >
              <Icon name="md-pulse"/>
              <Text uppercase={false}>Activity stream</Text>
            </Button>

            <View style={{height: 5}}/>

            <Button sidebar-button {...addEvents}
                    onPress={() => {
                      navigation.closeDrawer();
                      setTimeout(() => {
                        actions.rootScreenChange(rootScreenValue.events)
                      }, 100);
                    }}
            >
              <Icon name="md-calendar"/>
              <Text uppercase={false}>Events</Text>
            </Button>

            <View style={{height: 5}}/>

            <Button sidebar-button {...addFavorites}
                    onPress={() => {
                      navigation.closeDrawer();
                      setTimeout(() => {
                        actions.rootScreenChange(rootScreenValue.favorites)
                      }, 100);
                    }}
            >
              <Icon name="md-heart"/>
              <Text uppercase={false}>Favorites</Text>
            </Button>

            <View style={{height: 5}}/>

            <Button sidebar-button {...addSearch}
                    onPress={() => {
                      navigation.closeDrawer();
                      setTimeout(() => {
                        actions.rootScreenChange(rootScreenValue.search)
                      }, 100);
                    }}
            >
              <Icon name="md-search"/>
              <Text uppercase={false}>Search</Text>
            </Button>

            <View style={{height: 5}}/>

            <Button sidebar-button {...addNewTask}
                    onPress={() => {
                      navigation.closeDrawer();
                      setTimeout(() => {
                        actions.rootScreenChange(rootScreenValue.task_create)
                      }, 100);
                    }}
            >
              <Icon name="md-add" style={{marginLeft: 28}}/>
              <Text uppercase={false}>New task</Text>
            </Button>

            <View style={{height: 5}}/>

            <Button sidebar-button {...addSettings}
                    onPress={() => {
                      navigation.closeDrawer();
                      setTimeout(() => {
                        actions.rootScreenChange(rootScreenValue.settings)
                      }, 100);
                    }}
            >
              <Icon name="md-settings" style={{marginLeft: 28}}/>
              <Text uppercase={false}>Settings</Text>
            </Button>

            <View style={{height: 5}}/>

          </View>
          }

        </Content>
        <Footer gd-sidebar>
          <Grid>
            <Row style={{height:2}}></Row>
            {me && me.id ?
              <Row style={{height:36, alignItems:'center', /*borderWidth:1, borderColor:'red'*/}}>
                <UserIcon user={me} style={{marginLeft:17}}/>
                <Text style={{marginLeft:8, marginRight:0, width:emailWidth, fontSize:13, color:'#97A2A9'}}
                      numberOfLines={1}>{me.email}</Text>
                <Button transparent iconRight style={{height:36, width:93, /*borderWidth:1, borderColor:'blue',*/}}
                        onPress={() => {
                          navigation.closeDrawer();
                          actions.logout()
                            .then(() => {
                              //navigation.navigate('login');
                              actions.rootScreenChange(rootScreenValue.login)
                            })
                        }}>
                  <Text uppercase={false} style={{color:'#FFFFFF', fontSize:13, paddingLeft:2, paddingRight:10}}>Logout</Text>
                  <Icon name="md-exit" style={{color:'#FFFFFF', marginLeft:0, marginRight:20}}/>
                </Button>
              </Row>
              :
              <Row style={{height:36}}></Row>
            }
            <Row style={{height:18}}></Row>
            <Row style={{backgroundColor:'#253A45', height:56}}>
              <Col style={{flexDirection:'row', alignItems:'center', alignContent:'center'}}>
                <Image style={{width:18, height:18, marginLeft:27, marginRight:12}} source={logoSrc} />
                <Text style={{fontSize:10, color:'#6F7D84'}}>GoodDay v.{appInfo.version}</Text>
              </Col>
              {false &&
              <Col>
                <Button transparent style={{height:56, alignSelf:'flex-end'}}
                        onPress={() => { Linking.openURL('https://www.goodday.work/desktop') }}>
                  <Text uppercase={false} style={{color:'#FFFFFF', fontSize:12, paddingRight:20}}>Desktop version</Text>
                </Button>
              </Col>}
            </Row>
          </Grid>

        </Footer>
      </Container>
    </StyleProvider>
  )
}

function mapStateToProps(state) {
  return {
    me: state.me,
    activeScreen: state.rootScreen.screen
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      logout: () => dispatch(logout()),
      rootScreenChange: screen => dispatch(rootScreenChange(screen))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(sidebar);