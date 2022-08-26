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
import getTheme from '../../../app-theme/components'
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import { ScrollView } from 'react-native';
import { updateCustomFields } from '../../../redux/actions/task';
export class DropDownSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown: [],
            fieldNameValue: []
        }
    }
    componentDidMount() {
        const value = this.props.navigation.getParam('value')
        const fieldNameValue = this.props.navigation.getParam('fieldNameValue')
        this.setState({
            dropdown: [value && value.toString()],
            fieldNameValue: fieldNameValue && fieldNameValue
        })
    }
    selectedDropdown = (value) => {
        const task = this.props.navigation.getParam('propsData')
        const type = this.props.navigation.getParam('type')
        const id = this.props.navigation.getParam('id')
        this.props.updateCustomFields(task, id, value, type)
        this.props.navigation.goBack()
    }

    render() {
        const { navigation } = this.props
        const task = this.props.navigation.getParam('propsData')
        const project = gd.session.projects.get(task.projectId);
        const headerBg = '#' + gd.const.project.color[project.color];
        console.log(this.state, "this.state")
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
                    <ScrollView>
                        {this.state.fieldNameValue.map((item, index) =>
                            <ListItem key={index} style={ListStyle} onPress={() => this.selectedDropdown(item.id)}>
                                <View>
                                    <Text>{item.value}</Text>
                                </View>
                            </ListItem>
                        )}
                    </ScrollView>
                </Container>
            </StyleProvider>
        )
    }
}
const ListStyle = {
    padding: 20,
}
export default connect(null, { updateCustomFields })(DropDownSelection)