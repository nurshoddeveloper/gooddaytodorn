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
import { Image } from 'react-native'
import { Rating } from 'react-native-elements';
import getTheme from '../../../app-theme/components'
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import { updateCustomFields } from '../../../redux/actions/task';
export class EmailField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }
    saveEmail = () => {
        const task = this.props.navigation.getParam('propsData')
        const type = this.props.navigation.getParam('type')
        const { email } = this.state
        const id = this.props.navigation.getParam('id')
        this.props.updateCustomFields(task, id, email, type)
        this.props.navigation.goBack()
    }
    componentDidMount() {
        const value = this.props.navigation.getParam('value')
        this.setState({
            email: value && value.toString()
        })
    }
    render() {
        const { navigation } = this.props
        const task = this.props.navigation.getParam('propsData')
        const project = gd.session.projects.get(task.projectId);
        const headerBg = '#' + gd.const.project.color[project.color];
        const email = require('../../../../assets/icons/mail.png')
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
                        <ListItem style={{ paddingLeft: 15 }}>
                            <Image source={email} style={{ height: 17, width: 17, tintColor: "#565656" }} />
                            <Input
                                onChangeText={(text) => this.setState({ email: text })}
                                value={this.state.email}
                                placeholder='Enter the custom email'
                                style={{ paddingLeft: 10 }}
                            />
                        </ListItem>
                        <ListItem></ListItem>
                        <View style={buttonStyle}>
                            <Button primary block onPress={() => this.saveEmail()}>
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
export default connect(null, { updateCustomFields })(EmailField)