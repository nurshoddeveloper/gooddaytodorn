import React, { Component } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { InteractionManager, RefreshControl, PixelRatio } from 'react-native';
import {
  StyleProvider, Container, Header, Title, Content, View,
  Body, Left, Right,
  Icon, Text, Button
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../common/loading-content';
import { loadEvent } from '../../redux/actions/event';
import { loadEvents, refreshEventsMissingData } from '../../redux/actions/events';
import { Calendar } from 'react-native-calendars';
import EventsList from './list/events-list';


class EventsScreen extends Component {
  constructor(props) {
    super(props);
    this.renderResult = this.renderResult.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDayPress = this.handleDayPress.bind(this);
    this.handleEventPress = this.handleEventPress.bind(this);
    this.state = {
      splash: true,
      selectedDate: Moment()
    };
  }
  componentDidMount() {
    const { events, actions } = this.props;
    if (!events.isFetching
      && !events.error
      && (!events.events || events.events.length == 0)
    ) {
      actions.loadEvents();
    }
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({splash:false})
      });
    }, 50);
  }
  render() {
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Events</Title>
            </Body>
            <Right />
          </ColorHeader>
          {this.renderResult()}
        </Container>
      </StyleProvider>
    );
  }
  renderResult() {
    const { splash, selectedDate } = this.state;
    const { events: { isFetching, error, events } } = this.props;

    const rc = <RefreshControl refreshing={isFetching} onRefresh={this.handleRefresh} />;

    if (error) {
      return (
        <Content contentContainerStyle={{flex:1, alignItems:'center', justifyContent:'center'}}
                 refreshControl={rc}
        >
          <Text>Oops... Something went wrong.</Text>
        </Content>
      )
    }

    if (splash || isFetching) return <LoadingContent />;

    const markedDates = {};

    const list = events && events.exportToFullCalendar ? events.exportToFullCalendar() : [];
    const dayEvents = [];
    //console.log('events', Object.getOwnPropertyNames(events));
    //console.log('list', list);

    const daysInMonth = selectedDate.daysInMonth();
    const days = [];
    for (let d=1; d<=daysInMonth; d++) {
      days.push(Moment(selectedDate.format('YYYY-MM') + '-' + d, 'YYYY-MM-DD'));
    }

    const sdk = selectedDate.format('YYYY-MM-DD');

    days.forEach(de => {
      list.forEach(le => {
        const mStart = Moment(le.start);
        const mFinish  = le.end ? Moment(le.end) : Moment(le.start).add(1, 'day');
        if (de.isBetween(mStart, mFinish, 'days', '[)')) {
          const dk = de.format('YYYY-MM-DD');
          if (!markedDates[dk]) {
            markedDates[dk] = { marked: true };
          }

          if (dk == sdk) {
            dayEvents.push(le);
          }
        }
      })
    });

    // add selected date

    if (!markedDates[sdk]) {
      markedDates[sdk] = { selected: true };
    } else {
      markedDates[sdk].selected = true;
    }

    //console.log('days', days);
    //console.log('markedDates', markedDates);
    //console.log('dayEvents', dayEvents);

    return (
      <Content refreshControl={rc}>
        <Calendar
          // Initially visible month. Default = Date()
          current={selectedDate.format('YYYY-MM-DD')}
          markedDates={markedDates}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={undefined}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          //maxDate={maxDate}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            this.handleDayPress(Moment(day.dateString));
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'MMMM yyyy'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {
            const nd = getFirstDateWithEventsInMonth(list, Moment(month.dateString));
            this.handleDayPress(nd);
          }}
          // Hide month navigation arrows. Default = false
          //hideArrows={true}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          renderArrow={(direction) => (<Icon name={`arrow-drop${direction}`} style={{color: theme.brandPrimary}} />)}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={false}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // Hide day names. Default = false
          //hideDayNames={true}
          theme={{
            todayTextColor: theme.brandPrimary,
            selectedDayBackgroundColor: theme.brandPrimary,
            arrowColor: theme.brandPrimary,
            dotColor: theme.brandPrimary,
          }}
        />
        <View style={{height:6, borderTopWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1) , borderColor: theme.listBorderColor}}/>
        <EventsList items={dayEvents} onPress={this.handleEventPress} />
      </Content>
    );

  }
  handleDayPress(date) {
    this.props.actions.refreshEventsMissingData()
      .then(() => {
        this.setState({selectedDate: date});
      })
  }
  handleEventPress(eventId) {
    console.log('handleEventPress', eventId);
    this.props.actions.loadEvent(eventId);
    this.props.navigation.navigate('event_view');
  }
  handleRefresh() {
    this.props.actions.loadEvents();
  }
}


function mapStateToProps(state) {
  return {
    events: state.events
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadEvent: eventId => dispatch(loadEvent(eventId)),
      loadEvents: () => dispatch(loadEvents()),
      refreshEventsMissingData: () => dispatch(refreshEventsMissingData()),
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsScreen);


function getFirstDateWithEventsInMonth(events, month) {
  const sd = Moment(month);
  let fd = null;

  const daysInMonth = sd.daysInMonth();
  const days = [];
  for (let d=1; d<=daysInMonth; d++) {
    days.push(Moment(sd.format('YYYY-MM') + '-' + d, 'YYYY-MM-DD'));
  }

  days.some(de => {
    return events.some(le => {
      const mStart = Moment(le.start);
      const mFinish  = le.end ? Moment(le.end) : Moment(le.start).add(1, 'day');
      if (de.isBetween(mStart, mFinish, 'days', '[)')) {
        if (fd == null) fd = de;
        return true;
      }
    })
  });

  return fd || Moment(sd.format('YYYY-MM') + '-01', 'YYYY-MM-DD');
}
