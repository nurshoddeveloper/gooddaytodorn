import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    StyleProvider, Container, Footer, Title, Content,
    Body, Left, Right,
    Icon, Text, Button,
    Item, Input,
    Grid, Row, Col, View, ListItem, List, Form, Textarea
} from 'native-base';
import { Rating } from 'react-native-elements';
import getTheme from '../../../app-theme/components'
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import { updateCustomFields } from '../../../redux/actions/task';
import withNavigation from 'react-navigation/src/views/withNavigation';
export class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customText: ''
        }
    }
    componentDidMount() {
        const value = this.props.navigation.getParam('value')
        this.setState({
            customText: value && value.toString()
        })
    }
    saveCustomText = () => {
        const task = this.props.navigation.getParam('propsData')
        const type = this.props.navigation.getParam('type')
        const { customText } = this.state
        const id = this.props.navigation.getParam('id')
        this.props.updateCustomFields(task, id, customText, type)
        this.props.navigation.goBack()
    }
    render() {
        const { navigation } = this.props
        const { customText } = this.state
        const task = this.props.navigation.getParam('propsData')
        const id = this.props.navigation.getParam('id')
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
                            {/* <Button transparent onPress={this.handleRefresh}>
                                <Icon name="refresh" {...iconPropsAdd} />
                            </Button> */}
                        </Right>
                    </ColorHeader>
                    <Content style={MainHeader}>
                        <ListItem style={{ marginBottom: 10 }}>
                            <Textarea
                                onChangeText={(text) => this.setState({ customText: text })}
                                value={customText}
                                rowSpan={3}
                                placeholder="Enter the text"
                                style={{ marginBottom: 5, paddingLeft: '6%' }}
                            />
                        </ListItem>
                        {/* <ListItem></ListItem> */}
                        <View style={ButtonStyle}>
                            <Button primary block onPress={() => this.saveCustomText()}>
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
    alignSelf: 'center'
}
const ButtonStyle = {
    width: '90%',
    alignSelf: 'center'
}
export default withNavigation(connect(null, { updateCustomFields })(TextBox)) 