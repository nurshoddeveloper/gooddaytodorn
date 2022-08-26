import React from 'react';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon
} from 'native-base';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import getTheme from '../../../app-theme/components';
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';


export default class EventSelectDateScreen extends React.PureComponent {

  render() {
    const { navigation } = this.props;
    const { date, onPress } = navigation.state.params;
    console.log('date', date, typeof date);
    const markedDates = {};
    let currDate = Moment().format();
    if (date) {
      currDate = date.format();
      markedDates[date.format('YYYY-MM-DD')] = {selected: true};
    }
    console.log('markedDates', markedDates);

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
              <Title>Select date</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content>
            <Calendar
              // Initially visible month. Default = Date()
              current={currDate}
              markedDates={markedDates}
              // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
              //minDate={Moment().format()}
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
          </Content>
        </Container>
      </StyleProvider>
    );
  }

}
