import React, { Component } from 'react';
import { isNumeric } from '../../common/utils';
import { connect } from 'react-redux';
import { InteractionManager } from 'react-native';
import {
  StyleProvider, Container, Header, Title, Content,
  Body, Left, Right,
  Icon, Text, Button,
  Input, Item,
  Grid, Row
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../common/loading-content';
import { search, searchClear } from '../../redux/actions/search';
import { loadTask } from '../../redux/actions/task';
import SearchResult from './search-result';


function isQueryOk(query) {
  return isNumeric(query) || query.length >= 3;
}


class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '', splash: true, noCharsToSearch: false };
    this.iosOnChangeText = this.iosOnChangeText.bind(this);
    this.search = this.search.bind(this);
    this.androidClearInput = this.androidClearInput.bind(this);
    this.renderResult = this.renderResult.bind(this);
    this.handleTaskPress = this.handleTaskPress.bind(this);
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({splash: false})
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.search.query != '' && prevState.query == '') {
      return { query: nextProps.search.query};
    }
    return null;
  }

  render() {
    const { query } = this.state;
    const showAndroidClear = theme.platform === 'android' && query.length > 0;
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader searchBar rounded>
            <Grid>
              <Row>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                      <Icon name="menu" />
                    </Button>
                </Left>
                <Body>
                  <Title>Search</Title>
                </Body>
                <Right />
              </Row>
              <Row style={{paddingBottom:10, paddingRight:1}}>
                <Item>
                  <Icon name="md-search" />
                  <Input placeholder="Search"
                         defaultValue={query}
                         clearButtonMode="unless-editing"
                         onChangeText={this.iosOnChangeText}
                         onEndEditing={this.search}
                  />
                  {showAndroidClear && <Icon name="md-close" onPress={this.androidClearInput}/>}
                </Item>
              </Row>
            </Grid>
          </ColorHeader>
          {this.renderResult()}
        </Container>
      </StyleProvider>
    );
  }
  renderResult() {
    const { splash, noCharsToSearch } = this.state;
    const { search: { isFetching, error, result, query } } = this.props;

    if (error) {
      return (
        <Content contentContainerStyle={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <Text>Oops... Something went wrong.</Text>
        </Content>
      )
    }

    if (splash || isFetching) return <LoadingContent/>;

    if (noCharsToSearch || ((!result || result.length < 1) && isQueryOk(query))) {
      return (
        <Content contentContainerStyle={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <Text>Nothing found.</Text>
        </Content>
      )
    }

    return (
      <Content>
        <SearchResult items={result} onPress={this.handleTaskPress} />
      </Content>
    )
  }
  iosOnChangeText(text) {
    if (theme.platform === 'android') return;
    const query = String(text).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    //console.log('iosOnChangeText', query, 'length', query.length);
    if (query === '') {
      this.props.actions.searchClear();
      this.setState({query, noCharsToSearch: false});
    }
  }
  search(event) {
    //const { query } = this.state;
    const query =  String(event.nativeEvent.text).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    console.log('search', query, 'length', query.length);

    if (query == '') {
      this.props.actions.searchClear();
      this.setState({query, noCharsToSearch: false});
      return;
    }

    if (!isQueryOk(query)) {
      this.props.actions.searchClear();
      this.setState({query, noCharsToSearch: true});
      return;
    }

    this.setState({query, noCharsToSearch: false});
    this.props.actions.search(query);
  }
  androidClearInput() {
    this.setState({query: '', noCharsToSearch: false});
    this.props.actions.searchClear();
  }
  handleTaskPress(taskId) {
    console.log('handleTaskPress', taskId);
    this.props.actions.loadTask(taskId);
    this.props.navigation.navigate('task_view');
  }
}


function mapStateToProps(state) {
  return {
    search: state.search
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      search: query => dispatch(search(query)),
      searchClear: () => dispatch(searchClear()),
      loadTask: taskId => dispatch(loadTask(taskId)),
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchScreen);