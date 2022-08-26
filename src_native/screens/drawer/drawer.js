import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
//import { getStatusBarHeight } from 'react-native-status-bar-height';
import SideBar from './side-bar';
import RootScreen from './root-screen';

//const sbh = getStatusBarHeight();
const navigationOptions = {
  // headerStyle: {
  //  paddingTop: sbh,
  //  height: sbh
  // }
};

export default createDrawerNavigator(
  {
    root_screen: {
      screen: RootScreen,
      navigationOptions
    },
  },
  {
    initialRouteName: 'root_screen',
    contentComponent: props => <SideBar {...props} />
  }
);