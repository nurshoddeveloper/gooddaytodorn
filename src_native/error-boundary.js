import React from 'react';
import SplashScreen from 'rn-splash-screen';
import { View, Text } from 'react-native';


export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null,
  };
  componentDidCatch(error, info) {
    //console.log('ErrorBoundary.componentDidCatch', error, info);
    window.sentryLogger.captureException(error, {componentDidCatch: 1});
    this.setState({error, hasError: true});
    SplashScreen.hide();
  }
  render() {
    //console.log('ErrorBoundary.render', this.state.hasError)
    if (!this.state.hasError) {
      return this.props.children;
    }

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

}