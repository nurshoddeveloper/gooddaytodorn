import Moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon, Text,
  View
} from 'native-base';
import { Calendar } from 'react-native-calendars';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';


export default class SelectDateScreen extends React.PureComponent {

  render() {
    const { navigation } = this.props;
    const { date, onPress, showTodayTomorrowSomeday, showClear } = navigation.state.params;
    //console.log('date', date, typeof date);
    const markedDates = {};
    let currDate = Moment().format();
    if (date) {
      currDate = date.format();
      markedDates[date.format('YYYY-MM-DD')] = {selected: true};
    }
    //console.log('markedDates', markedDates);

    const title = navigation.state.params.title || 'Select date';
    let minDateValue = Moment().format(); // today
    if ('minDate' in navigation.state.params) {
      const paramMinDate = navigation.state.params.minDate;
      if (!paramMinDate) minDateValue = null; // all dates
      else if (Moment.isMoment(paramMinDate)) {
        minDateValue = paramMinDate.format();
      }
    }

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
              <Title>{title}</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <Calendar
              // Initially visible month. Default = Date()
              current={currDate}
              markedDates={markedDates}
              // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
              minDate={minDateValue}
              // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
              //maxDate={maxDate}
              // Handler which gets executed on day press. Default = undefined
              onDayPress={(day) => {
                  //console.log('selected day', day)
                  onPress(Moment(day.dateString));
                  navigation.goBack();
              }}
              // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
              monthFormat={'MMMM yyyy'}
              // Handler which gets executed when visible month changes in calendar. Default = undefined
              //onMonthChange={(month) => {console.log('month changed', month)}}
              // Hide month navigation arrows. Default = false
              //hideArrows={true}
              // Replace default arrows with custom ones (direction can be 'left' or 'right')
              renderArrow={(direction) => (<Icon name={`arrow-drop${direction}`} style={{color: theme.brandPrimary}} />)}
              // Do not show days of other months in month page. Default = false
              hideExtraDays={true}
              // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
              // day from another month that is visible in calendar page. Default = false
              disableMonthChange={true}
              // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
              firstDay={1}
              // Hide day names. Default = false
              //hideDayNames={true}
              theme={{
                todayTextColor: theme.brandPrimary,
                selectedDayBackgroundColor: theme.brandPrimary,
                arrowColor: theme.brandPrimary,
              }}
            />

            {showTodayTomorrowSomeday &&
            <View style={{padding: 20}}>
              <Button block onPress={() => {
                onPress(Moment());
                navigation.goBack();
              }}>
                <Text>Today</Text>
              </Button>
              <Button block style={{marginVertical: 20}} onPress={() => {
                onPress(Moment().add(1, 'day'));
                navigation.goBack();
              }}>
                <Text>Tomorrow</Text>
              </Button>
              <Button block onPress={() => {
                onPress('someday');
                navigation.goBack();
              }}>
                <Text>Someday</Text>
              </Button>
            </View>
            }

            {showClear &&
            <View style={{padding: 20}}>
              <Button block onPress={() => {
                onPress(null);
                navigation.goBack();
              }}>
                <Text>Clear date</Text>
              </Button>
            </View>
            }

          </Content>
        </Container>
      </StyleProvider>
    );
  }

}


SelectDateScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        title: PropTypes.string,
        minDate: PropTypes.object,
        date: PropTypes.object,
        onPress: PropTypes.func.isRequired,
        showTodayTomorrowSomeday: PropTypes.bool,
        showClear: PropTypes.bool,
      })
    })
  })
};
