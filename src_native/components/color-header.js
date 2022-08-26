import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { Header } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import color from 'color';
import theme from '../app-theme/variables/platform';


function getDarkerStatusBarColor(fromColor) {
  return color(fromColor)
    .darken(0.2)
    .hex();
}

export default class ColorHeader extends React.PureComponent {

  constructor(props) {
    super(props);
    this.routeName = window.nativeAppCurrRouteName;
  }

  render() {
    const headerProps = {...this.props};
    delete headerProps.children;

    if (Platform.OS == 'ios') {
      return (
        <Header {...headerProps}>
          {this.props.children}
        </Header>
      )
    }

    const bgColor = this.props.style && this.props.style.backgroundColor ? this.props.style.backgroundColor : theme.toolbarDefaultBg;

    if (!('style' in headerProps)) headerProps.style = { backgroundColor: bgColor };
    else headerProps.style.backgroundColor = bgColor;
    //console.log('ColorHeader.render bgColor', bgColor);

    return (
      <Header {...headerProps}>
        <NavigationEvents
          /*onWillFocus={() => {
            console.log('will focus', payload);
            console.log('bgColor', bgColor);
            StatusBar.setBackgroundColor(bgColor);
          }}*/
          onDidFocus={payload => {
            //console.log('did focus', payload);
            //console.log('ColorHeader.onDidFocus bgColor', bgColor);
            StatusBar.setBackgroundColor(getDarkerStatusBarColor(bgColor));
          }}
          //onWillBlur={payload => console.log('will blur',payload)}
          //onDidBlur={payload => console.log('did blur',payload)}
        />
        {this.props.children}
      </Header>
    )
  }

  componentDidUpdate() {
    if (Platform.OS == 'ios') return;
    if (window.nativeAppCurrRouteName !== this.routeName) return;

    const bgColor = this.props.style && this.props.style.backgroundColor ? this.props.style.backgroundColor : theme.toolbarDefaultBg;
    //console.log('ColorHeader.componentDidUpdate bgColor', bgColor, this.routeName, window.nativeAppCurrRouteName);
    StatusBar.setBackgroundColor(getDarkerStatusBarColor(bgColor));
  }

}
