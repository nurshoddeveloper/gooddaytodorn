import React from 'react';
import { connect } from 'react-redux';
import {View, Image, Dimensions, Text} from 'react-native';
import {
  StyleProvider,
  Container, Header, Title, Content, Button, Left, Right, Icon,
  InputGroup, Input, Form
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import { login, loginGoogle } from '../../redux/actions/auth';
import logoSrc from '../../../assets/images/android-icon-72x72.png';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LoginForm from './login-form';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.toggleKeyboard = this.toggleKeyboard.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      keyboardVisible: false,
      keyboardHeight: 0,
      email: '',
      emailChecked: false,
      marginTop: this.getMarginTop(0),
      error: null
    };

    //this.onLayout = this.onLayout.bind(this);
    this.onOrientation = this.onOrientation.bind(this);
  }
  getMarginTop(keyboardHeight) {
    const { height } = Dimensions.get('window');
    const formHeight = 260 + 72;
    let marginTop = parseInt((height -keyboardHeight- formHeight) / 2);
    if (marginTop < 0) marginTop = 0;
    return marginTop;
  }
  toggleKeyboard(visible, height) {
    this.setState({keyboardVisible: visible, keyboardHeight: height, marginTop: this.getMarginTop(height)});
  }
  componentDidMount() {
    this.setState({email: window.nativeAppLastEmail, emailChecked: true});
    Dimensions.addEventListener('change', this.onOrientation);
    GoogleSignin.configure({
      webClientId: '588823826282-d6b2vr4a782mvium4lnjgql8rr7oirjb.apps.googleusercontent.com'
    })
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onOrientation);
  }
  onOrientation({window}) {
    const orientation = window.height > window.width ? 'portrait' : 'landscape';
    const marginTop = this.getMarginTop(this.state.keyboardHeight);
    this.setState({ orientation, marginTop });
  }
  _signIn = async () => {
    const { navigation, actions } = this.props;
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await actions.loginGoogle(userInfo?.user)
        .then(() => {
          navigation.goBack();
        })
        .catch((err) => this.setState({ error: err?.errors?._error }))
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  render() {
    const { emailChecked, marginTop, error } = this.state;
    if (!emailChecked) return null;
    const initialValues = {
      email: this.state.email,
      password: this.state.password,
      error
    };
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <Content>

            <View style={{marginHorizontal: 20, marginTop}}>
              <View style={{alignItems:'center', marginBottom: 10}}>
                <Image style={{width: 72, height: 72}} source={logoSrc} />
              </View>
              <LoginForm initialValues={initialValues} onSubmit={this.handleFormSubmit} />
            </View>

            <Text style={{color: theme.brandDark, fontFamily: theme.titleFontfamily, textAlign: 'center', marginVertical: 20}}>OR</Text>

            <GoogleSigninButton
              style={{width: 192, height: 48, alignSelf: 'center'}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this._signIn}
            />

            <KeyboardSpacer onToggle={this.toggleKeyboard} />

          </Content>
        </Container>
      </StyleProvider>
    );
  }
  handleFormSubmit(values, dispatch) {
    const { navigation, actions } = this.props;
    const p = actions.login(values.email, values.password);
      p.then(() => {
        navigation.goBack();
      })
      .catch(() => {});
    return p;
  }
  /*onLayout(e, block) {
    console.log('onLayout', block, e.nativeEvent.layout);
  }*/
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      login: (email, password) => dispatch(login(email, password)),
      loginGoogle: (user) => dispatch(loginGoogle(user))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
