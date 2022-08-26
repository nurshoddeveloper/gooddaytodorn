import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    StyleProvider, Container, Footer, Title, Content,
    Body, Left, Right,
    Icon, Text, Button,
    Input, ListItem, List, View
} from 'native-base';
import { Image } from 'react-native'
import getTheme from '../../../app-theme/components'
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import { updateCustomFields } from '../../../redux/actions/task';
export class LinkField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkField: ''
        }
    }
    saveLink = () => {
        const task = this.props.navigation.getParam('propsData')
        const type = this.props.navigation.getParam('type')
        const { linkField } = this.state
        const id = this.props.navigation.getParam('id')
        this.props.updateCustomFields(task, id, linkField, type)
        this.props.navigation.goBack()
    }
    componentDidMount() {
        const value = this.props.navigation.getParam('value')
        this.setState({
            linkField: value && value.toString()
        })
    }
    render() {
        const { navigation } = this.props
        const task = this.props.navigation.getParam('propsData')
        const project = gd.session.projects.get(task.projectId);
        const headerBg = '#' + gd.const.project.color[project.color];
        const link = require('../../../../assets/icons/link.png')
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
                            <Image source={link} style={{ height: 17, width: 17, tintColor: "#565656" }} />
                            <Input
                                onChangeText={(text) => this.setState({ linkField: text })}
                                value={this.state.linkField}
                                autoCapitalize="none"
                                placeholder={'Enter the link address'}
                                style={{ paddingLeft: 10 }}
                            />
                        </ListItem>
                        <ListItem></ListItem>
                        <View style={buttonStyle}>
                            <Button primary block onPress={() => this.saveLink()} >
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
export default connect(null, { updateCustomFields })(LinkField)