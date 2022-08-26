import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon, Text,
  View,
} from 'native-base';
import getTheme from '../../../app-theme/components';
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import ProgressForm from './progress-form';



export default class SelectProgressScreen extends React.PureComponent {

  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(values, dispatch) {
    const { navigation } = this.props;
    //console.log('SelectProgressScreen', 'handleFormSubmit', values);
    let percent = values.percent ? parseInt(values.percent) : 0;
    if (isNaN(percent)) percent = null;

    navigation.state.params.onPress(percent);
    navigation.goBack();
  }

  render() {
    const { navigation } = this.props;
    const { value, onPress } = navigation.state.params;

    const generateHandler = (val) => {
      return () => {
        onPress(val);
        navigation.goBack();
      }
    };

    const initialValues = {
      percent: value > 0 ? String(value) : '',
    };

    console.log('initialValues', initialValues);

    const progressItems = [
      {value: 0, label: '0%'},
      {value: 10, label: '10%'},
      {value: 20, label: '20%'},
      {value: 30, label: '30%'},
      {value: 40, label: '40%'},
      {value: 50, label: '50%'},
      {value: 60, label: '60%'},
      {value: 70, label: '70%'},
      {value: 80, label: '80%'},
      {value: 90, label: '90%'},
      {value: 100, label: '100%'},
    ];


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
              <Title>Select progress</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <View estimate-group-header>
              <Text>Progress</Text>
            </View>
            <View estimate-group-content>
              {this.renderQuickButtons(progressItems, value, generateHandler)}
            </View>

            <View estimate-form-block>
              <ProgressForm initialValues={initialValues} onSubmit={this.handleFormSubmit} />
              <Button style={{marginTop: 30}} block onPress={generateHandler(null)}>
                <Text>Clear progress</Text>
              </Button>
            </View>

          </Content>
        </Container>
      </StyleProvider>
    );
  }

  renderQuickButtons(list, value, generateHandler) {
      const arr = [];

      list.forEach(item => {
        const add = {};
        if (item.value == value && value !== '') {
          //
        } else {
          add.light = true;
        }
        arr.push(<Button rounded {...add} onPress={generateHandler(item.value)} key={item.value}><Text style={{fontSize:14}}>{item.label}</Text></Button>)
      });

      return arr;
  }
}


SelectProgressScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        value: PropTypes.number,
        onPress: PropTypes.func.isRequired,
      })
    })
  })
};
