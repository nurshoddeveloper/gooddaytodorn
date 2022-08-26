import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    StyleProvider, Container, Title, Content,
    Body, Left, Right,
    Icon, Text, Button,
    Input, ListItem, List, Form, Item, Label, View
} from 'native-base';
import { Image, TextInput } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/FontAwesome'
import getTheme from '../../../app-theme/components'
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import withNavigation from 'react-navigation/src/views/withNavigation';
import { updateCustomFields } from '../../../redux/actions/task';

const numberIcon = require('../../../../assets/icons/percent.png')
class PercentageField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percentage: ''
        }
    }
    saveAmount = () => {
        const task = this.props.navigation.getParam('propsData')
        const type = this.props.navigation.getParam('type')
        const { percentage } = this.state
        const id = this.props.navigation.getParam('id')
        this.props.updateCustomFields(task, id, percentage, type)
        this.props.navigation.goBack()
    }
    componentDidMount() {
        const value = this.props.navigation.getParam('value')
        this.setState({
            percentage: value && value.toString()
        })
    }
    render() {
        const { navigation } = this.props
        const task = this.props.navigation.getParam('propsData')
        const project = gd.session.projects.get(task.projectId);
        const headerBg = '#' + gd.const.project.color[project.color];
        return (
            <StyleProvider style={getTheme(theme)}>
                <Container>
                    <ColorHeader noShadow noBottomBorder style={{ backgroundColor: headerBg }}>
                        <Left>
                            <Button transparent onPress={() => navigation.goBack()}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title ellipsizeMode="head">{'Custom Field Name'}</Title>
                        </Body>
                        <Right>
                        </Right>
                    </ColorHeader>
                    <Content style={MainHeader}>
                        <ListItem style={{ paddingLeft: 15 }}>
                            <Image source={numberIcon} style={{ height: 15, width: 15, tintColor: '#565656' }} />
                            <Input
                                onChangeText={(text) => this.setState({ percentage: text })}
                                value={this.state.percentage}
                                placeholder='Enter Percentage'
                                keyboardType={'numeric'}
                                style={{ paddingLeft: 10 }}
                            />
                        </ListItem>
                        <ListItem></ListItem>
                        <View style={buttonStyle}>
                            <Button onPress={() => this.saveAmount()} primary block>
                                <Text>Save</Text>
                            </Button>
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}
const MainHeader = {
    width: '100%',
    alignSelf: 'center',
}
const buttonStyle = {
    width: '90%',
    alignSelf: 'center',
}
function mapStateToProps(state) {
    return {
        task: state.task,
    }
}
export default withNavigation(connect(mapStateToProps, {
    updateCustomFields
})(PercentageField))