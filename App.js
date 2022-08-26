import React from 'react';
import { View, Text } from 'react-native';
import { Root } from 'native-base'; // for Toast
import { Provider } from 'react-redux';
import SplashScreen from 'rn-splash-screen';
import { sentryStart } from  './src_native/common/sentry';
import configureStore from './src_native/redux/configure-store';
import AppNavigator from './src_native/app-navigator';
import prepareGdEnvironment from './src_native/prepare-start';
import ErrorBoundary from './src_native/error-boundary';


sentryStart();
const store = configureStore();


// https://reactnavigation.org/docs/guides/screen-tracking#Screen-tracking
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}


class AppLoader extends React.PureComponent {
  state = {
    gdPrepared: false,
    gdNotPrepared: false,
  };
  componentDidMount() {
    const prepared = prepareGdEnvironment(store);
    prepared
      .then(() => {
        this.setState({ gdPrepared: true });
        //SplashScreen.hide(); // moved to my-work and login screens
        setTimeout(() => SplashScreen.hide(), 200); //need time for navigator to render
      })
      .catch(e => {
        window.sentryLogger.captureMessageError(e || 'gd env not prepared', {catch_prepareGdEnvironment: 1});
        this.setState({ gdNotPrepared: true });
        SplashScreen.hide();
      });
  }
  render() {
    const { gdPrepared, gdNotPrepared } = this.state;
    //console.log('AppLoader.render', gdPrepared, gdNotPrepared);

    if (gdNotPrepared) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center'}}>
            Sorry, something went wrong.
          </Text>
          <Text style={{textAlign: 'center'}}>
            Please restart the GoodDay application.
          </Text>
        </View>
      );
    }

    if (!gdPrepared) return null;

    return (
      <Provider store={store}>
        <Root collapsable={false}>
          <AppNavigator onNavigationStateChange={(prevState, currentState) => {
            const currentRouteName = getCurrentRouteName(currentState);
            // than save the currentKey based on your project structure
            //console.log('currentRouteName', currentRouteName);
            window.nativeAppCurrRouteName = currentRouteName;
          }}
          />
        </Root>
      </Provider>
    )
  }
}

export default function appHolder() {
  return (
    <ErrorBoundary>
      <AppLoader />
    </ErrorBoundary>
  )
}
