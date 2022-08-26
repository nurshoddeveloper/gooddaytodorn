import React from 'react';
import { Image, Dimensions, Linking } from 'react-native';
import {
  StyleProvider, Container, Header, Title, Content,
  Body, Left, Right,
  Icon, Button
} from 'native-base';
import ImageZoom from 'react-native-image-pan-zoom';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from './loading-content';

export default class ViewImageScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { imageWidth: null, imageHeight: null, orientation: null };
    this.onOrientation = this.onOrientation.bind(this);
  }
  componentDidMount() {
    const { uri } = this.props.navigation.state.params;
    Image.getSize(uri,
      (width, height) => { this.setState({imageWidth: width, imageHeight: height}) },
      (e) => { console.log('Image.getSize', e) }
    );
    Dimensions.addEventListener('change', this.onOrientation);
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onOrientation);
  }
  onOrientation({window}) {
    this.setState({
      orientation: window.height > window.width ? 'portrait' : 'landscape'
    });
  }
  render() {
    const { navigation } = this.props;
    const { uri, name } = navigation.state.params;
    //console.log('ViewImageScreen', 'uri', uri, 'name', name);

    const ww = Dimensions.get('window').width;
    const wh = Dimensions.get('window').height;
    //console.log('ww', ww, 'wh', wh);
    const cw = ww;
    const ch = wh - theme.toolbarHeight;
    //console.log('cw', cw, 'ch', ch);
    let iw = 1;
    let ih = 1;

    const { imageWidth, imageHeight } = this.state;

    const loading = !imageWidth || !imageHeight;
    //console.log('loading', loading);
    if (imageWidth && imageHeight) {
      iw = imageWidth;
      ih = imageHeight;
      if (imageWidth > cw) iw = cw;
      if (imageHeight > ch) ih = ch;
    }
    //console.log('iw', iw, 'ih', ih);

    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name="arrow-back"/>
              </Button>
            </Left>
            <Body>
              <Title>{name}</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => Linking.openURL(uri)}>
                <Icon name="download"/>
              </Button>
            </Right>
          </ColorHeader>
          {loading
            ?
            <LoadingContent />
            :
            <Content>
              <ImageZoom cropWidth={cw}
                         cropHeight={ch}
                         imageWidth={iw}
                         imageHeight={ih}>
                <Image style={{width:iw, height:ih}}
                       source={{uri}}
                       resizeMode="contain"
                />
              </ImageZoom>
            </Content>
          }

        </Container>
      </StyleProvider>
    )
  }
}


