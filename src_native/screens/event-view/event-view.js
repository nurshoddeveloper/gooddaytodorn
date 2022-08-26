import React, { Component } from 'react';
import { InteractionManager, Alert } from 'react-native';
import {
  StyleProvider, Container, Header, Footer, FooterTab, Title, Subtitle, Content,
  Body, Left, Right,
  Icon, Text, Button, Input,
  List, ListItem, Item,
  Grid, Row, Col, View
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../../screens/common/loading-content';
import FieldDate from './fields/date';
import FieldStatus from './fields/status';
import FieldAssignedTo from './fields/assigned-to';
import FieldNotes from './fields/notes';
import EventIcon from '../../components/icon/event-icon';

class EventView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      splash: true,
      event: null, // event to re-render after fields change
    };
    this.renderProject = this.renderProject.bind(this);
    this.renderUser = this.renderUser.bind(this);
    this.renderOrganization = this.renderOrganization.bind(this);
    this.renderEventType = this.renderEventType.bind(this);

    this.renderDelete = this.renderDelete.bind(this);
    this.handleDeleteEvent = this.handleDeleteEvent.bind(this);

    this.openSelectDateStartScreen = this.openSelectDateStartScreen.bind(this);
    this.selectDateStart = this.selectDateStart.bind(this);
    this.openSelectDateEndScreen = this.openSelectDateEndScreen.bind(this);
    this.selectDateEnd = this.selectDateEnd.bind(this);

    this.openSelectStatusScreen = this.openSelectStatusScreen.bind(this);
    this.selectStatus = this.selectStatus.bind(this);

    this.openSelectAssignedUserScreen = this.openSelectAssignedUserScreen.bind(this);
    this.selectAssignedUser = this.selectAssignedUser.bind(this);

    this.updateNotes = this.updateNotes.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const eventCur = state.event;
    const eventNew = props.event;
    if (!eventCur && eventNew) {
      return { event: eventNew };
    }
    if (eventCur && eventNew && eventCur.id != eventNew.id) {
      return { event: eventNew };
    }
    return null;
  }
  render() {
    const { editable, navigation } = this.props;
    const { splash, event } = this.state;

    //const project = gd.session.projects.get(event.projectId);
    //const taskType = gd.session.taskTypes.get(task.taskTypeId);
    console.log('event', event);

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
              <Title>{event.name}</Title>
            </Body>
            <Right />
          </ColorHeader>
          { splash
            ?
            <LoadingContent />
            :
            <Content>
              <List>
                <FieldDate event={event}
                           editable={editable}
                           openSelectDateStartScreen={this.openSelectDateStartScreen}
                           openSelectDateEndScreen={this.openSelectDateEndScreen} />

                <FieldStatus event={event}
                             editable={editable}
                             openSelectStatusScreen={this.openSelectStatusScreen} />

                <FieldAssignedTo event={event}
                                 editable={editable}
                                 openSelectAssignedUserScreen={this.openSelectAssignedUserScreen} />

                <FieldNotes event={event}
                            editable={editable}
                            updateNotes={this.updateNotes} />

                {this.renderProject()}
                {this.renderUser()}
                {this.renderOrganization()}

                {this.renderEventType()}
              </List>
              {this.renderDelete()}
            </Content>
          }
        </Container>
      </StyleProvider>
    );
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({splash:false})
    });
  }
  renderProject() {
    const { event } = this.state;

    if (event.scope !== 'project') return null;

    const eventProject = (event.project) ? event.project : gd.session.projects.get(event.projectId);
    const eventCompany = (event.company) ? event.company : gd.session.companies.get(event.companyId);

    const company = (!gd.isSingleOrganization()) ? <Text> / {eventCompany.name}</Text> : false;

    return (
      <ListItem eventViewFieldItem>
        <Body>
          <Text note>Project</Text>
          <Grid>
            <Row>
              <Text style={{color:theme.textGrayColor}}>{eventProject.name}</Text>
              {company}
            </Row>
          </Grid>
        </Body>
        <Right />
      </ListItem>
    );

  }
  renderUser() {
    const { event } = this.state;

    if (event.scope !== 'personal') return null;

    const eventUser = (event.user) ? event.user : gd.session.users.get(event.userId);
    const eventCompany = (event.company) ? event.company : gd.session.companies.get(event.companyId);

    const company = (!gd.isSingleOrganization()) ? <Text style={{color:theme.textGrayColor}}> / {eventCompany.name}</Text> : false;

    return (
      <ListItem eventViewFieldItem>
        <Body>
          <Text note>User</Text>
          <Grid>
            <Row>
              <Text>{eventUser.name}</Text>
              {company}
            </Row>
          </Grid>
        </Body>
        <Right />
      </ListItem>
    );
  }
  renderOrganization() {
    const { event } = this.state;

    if (event.scope !== 'organization') return null;

    const eventCompany = (event.company) ? event.company : gd.session.companies.get(event.companyId);

    return (
      <ListItem eventViewFieldItem>
        <Body>
          <Text note>Organization</Text>
          <Text>{eventCompany.name}</Text>
        </Body>
        <Right />
      </ListItem>
    );
  }
  renderEventType() {
    const { event } = this.state;

    const eventTypeName = gd.const.event.typeList[event.type];

    return (
      <ListItem eventViewFieldItem>
        <Body>
          <Text note>Event type</Text>
          <Grid>
            <Row>
              <Col style={{flex:0, marginRight:10, paddingTop:3}}>
                <EventIcon event={event} />
              </Col>
              <Col>
                <Text>{eventTypeName}</Text>
              </Col>
            </Row>
          </Grid>
        </Body>
        <Right />
      </ListItem>
    );
  }
  renderDelete() {
    const { editable } = this.props;
    if (!editable) return null;
    return (
      <Button style={{margin:15}} onPress={this.handleDeleteEvent}>
        <Text>Delete event</Text>
      </Button>
    )
  }
  handleDeleteEvent() {
    const { editable, actions, event, navigation } = this.props;
    if (!editable) return;
    Alert.alert(
      '',
      'Are you sure that you want to delete this event ?',
      [
        {text: 'Yes', onPress: () => {
            actions
              .deleteEvent(event.id)
              .then(() => {
                navigation.goBack();
              })
          }},
        {text: 'No', onPress: () => {}},
      ]
    )
  }

  openSelectDateStartScreen() {
    const { event } = this.state;
    this.props.navigation.navigate('event_select_date', {date: event.startDate, onPress:this.selectDateStart});
  }
  selectDateStart(date) {
    console.log('selectDateStart', date);
    const { event } = this.state;
    const { actions } = this.props;
    event.startDate = date;
    actions
      .updateEventStartend(event)
      .then(() => {
        this.setState({event})
      });
  }
  openSelectDateEndScreen() {
    const { event } = this.state;
    this.props.navigation.navigate('event_select_date', {date: event.endDate, onPress:this.selectDateEnd});
  }
  selectDateEnd(date) {
    console.log('selectDateEnd', date);
    const { event } = this.state;
    const { actions } = this.props;
    if (date.isBefore(event.startDate, 'days')) return; // prevent setting end before start
    event.endDate = date;
    actions
      .updateEventStartend(event)
      .then(() => {
        this.setState({event})
      });
  }

  openSelectStatusScreen() {
    this.props.navigation.navigate('event_select_status', {onPress:this.selectStatus});
  }
  selectStatus(statusId) {
    console.log('selectStatus', statusId);
    const { event } = this.state;
    const { actions } = this.props;
    event.isAccomplished = statusId == 'accomplished';
    actions
      .updateEventAccomplished(event)
      .then(() => {
        this.setState({event})
      });
  }

  openSelectAssignedUserScreen() {
    const { event } = this.state;
    const eventAssignedToUser = event.assignedToUser ? event.assignedToUser : gd.session.users.get(event.assignedToUserId);
    const userId = eventAssignedToUser ? eventAssignedToUser.id : null;
    this.props.navigation.navigate('event_select_user', {event, userId, onPress:this.selectAssignedUser});
  }
  selectAssignedUser(userId) {
    console.log('selectAssignedUser', userId);
    const { event } = this.state;
    const { actions } = this.props;
    event.assignedToUser = gd.session.users.get(userId);
    actions
      .updateEventAssigned(event)
      .then(() => {
        this.setState({event})
      });
  }

  updateNotes(notes) {
    console.log('updateNotes', notes);
    const { event } = this.state;
    const { actions } = this.props;
    event.notes = notes;
    actions
      .updateEventNotes(event)
      .then(() => {
        this.setState({event})
      });
  }
}

export default EventView;