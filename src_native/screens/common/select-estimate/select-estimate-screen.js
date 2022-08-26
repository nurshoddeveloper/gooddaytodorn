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
import EstimateForm from './estimate-form';



export default class SelectEstimateScreen extends React.PureComponent {

  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(values, dispatch) {
    const { navigation } = this.props;
    //console.log('SelectEstimateScreen', 'handleFormSubmit', values);
    const hours = values.hours ? parseInt(values.hours) : 0;
    const minutes = values.minutes ? parseInt(values.minutes) : 0;

    let estimate = hours * 60 + minutes;
    if (estimate <= 0) estimate = null;

    navigation.state.params.onPress(estimate);
    navigation.goBack();
  }

  render() {
    const { navigation } = this.props;
    const { value, onPress } = navigation.state.params;
    //const value = 45;
    //const onPress = () => {};

    const generateHandler = (val) => {
      return () => {
        onPress(val);
        navigation.goBack();
      }
    };

    const hours = value ? Math.floor(value / 60) : 0;
    const minutes = value ? value % 60 : 0;
    const estimate = hours * 60 + minutes;

    const initialValues = {
      hours: hours > 0 ? String(hours) : '',
      minutes: minutes > 0 ? String(minutes) : '',
    };

    console.log('initialValues', initialValues);

    const minutesSelectorItems = [];
    minutesSelectorItems.push({value: 15, label: '15'});
    minutesSelectorItems.push({value: 30, label: '30'});
    minutesSelectorItems.push({value: 45, label: '45'});

    const hoursSelectorItems = [];
    hoursSelectorItems.push({value: 60, label: '1'});
    hoursSelectorItems.push({value: 120, label: '2'});
    hoursSelectorItems.push({value: 180, label: '3'});
    hoursSelectorItems.push({value: 240, label: '4'});
    hoursSelectorItems.push({value: 300, label: '5'});
    hoursSelectorItems.push({value: 360, label: '6'});
    hoursSelectorItems.push({value: 420, label: '7'});

    const daysSelectorItems = [];
    daysSelectorItems.push({value: 480, label: '1'});
    daysSelectorItems.push({value: 960, label: '2'});
    daysSelectorItems.push({value: 1440, label: '3'});
    daysSelectorItems.push({value: 1920, label: '4'});

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
              <Title>Select estimate</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <View estimate-group-header>
              <Text>Minutes</Text>
            </View>
            <View estimate-group-content>
              {this.renderQuickButtons(minutesSelectorItems, estimate, generateHandler)}
            </View>

            <View estimate-group-header>
              <Text>Hours</Text>
            </View>
            <View estimate-group-content>
              {this.renderQuickButtons(hoursSelectorItems, estimate, generateHandler)}
            </View>


            <View estimate-group-header>
              <Text>Days</Text>
            </View>
            <View estimate-group-content>
              {this.renderQuickButtons(daysSelectorItems, estimate, generateHandler)}
            </View>

            <View estimate-form-block>
              <EstimateForm initialValues={initialValues} onSubmit={this.handleFormSubmit} />
              <Button style={{marginTop: 30}} block onPress={generateHandler(null)}>
                <Text>Clear estimate</Text>
              </Button>
            </View>

          </Content>
        </Container>
      </StyleProvider>
    );
  }

  renderQuickButtons(list, estimate, generateHandler) {
      const arr = [];

      list.forEach(item => {
        const add = {};
        if (item.value == estimate) {
          //
        } else {
          add.light = true;
        }
        arr.push(<Button rounded {...add} onPress={generateHandler(item.value)} key={item.value}><Text style={{fontSize:14}}>{item.label}</Text></Button>)
      });

      return arr;
  }
}


SelectEstimateScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        value: PropTypes.number,
        onPress: PropTypes.func.isRequired,
      })
    })
  })
};
