import React from 'react';
import { connect } from 'react-redux';
import {
  StyleProvider, Container, Header, Title, Content, View,
  Body, Left, Right,
  Icon, Text, Button
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../common/loading-content';
import EventView from './event-view';
import {
  updateEventStartend,
  updateEventAccomplished,
  updateEventAssigned,
  updateEventNotes,
  deleteEvent
} from '../../redux/actions/event';
import { loadEvents } from '../../redux/actions/events';

class EventViewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.renderLoading = this.renderLoading.bind(this);
    this.renderError = this.renderError.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
  }
  render() {
    const { isFetching, error, event } = this.props.event;

    let render = this.renderLoading;
    if (isFetching) render = this.renderLoading;
    else if (error) render = this.renderError;
    else if (event) render = this.renderEvent;

    return render();
  }
  renderLoading() {
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Event view</Title>
            </Body>
            <Right />
          </ColorHeader>
          <LoadingContent />
        </Container>
      </StyleProvider>
    );
  }
  renderError() {
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Event view</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content style={{padding:20}} contentContainerStyle={{flexDirection:'column', alignItems:'center'}}>
            <Text style={{fontSize:30, color:theme.textGrayColor}}>404</Text>
            <Text style={{marginTop:10, color:theme.textGrayColor, textAlign:'center'}}>The requested event is not found or you have no access.</Text>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
  renderEvent() {
    const { event: { event }, me, navigation, actions } = this.props;
    const editable = gd.ac.check.canEditEvent(event);
    return <EventView me={me} event={event} editable={editable} navigation={navigation} actions={actions} />;
  }
}


function mapStateToProps(state) {
  return {
    me: state.me,
    event: state.event
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadEvents: () => dispatch(loadEvents()),
      updateEventStartend: event => dispatch(updateEventStartend(event)),
      updateEventAccomplished: event => dispatch(updateEventAccomplished(event)),
      updateEventAssigned: event => dispatch(updateEventAssigned(event)),
      updateEventNotes: event => dispatch(updateEventNotes(event)),
      deleteEvent: eventId => dispatch(deleteEvent(eventId)),
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventViewScreen);