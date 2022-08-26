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
import Switch from 'react-native-switch-pro'
class MultiValues extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: '',
            fieldNameValue: [],
            selected: false
        }
    }
    componentDidMount() {
        const value = this.props.navigation.getParam('value')
        const fieldNameValue = this.props.navigation.getParam('fieldNameValue')
        this.setState({
            selectedValue: value,
            fieldNameValue: fieldNameValue && fieldNameValue
        })
    }
    selectedDropdown = (value) => {
        let selectedArray = this.state.selectedValue
        if (selectedArray && selectedArray.indexOf(value) !== -1) {
            selectedArray.splice(selectedArray.indexOf(value), 1)
        } else {
            selectedArray.push(value)
        }
        this.setState({
            selectedValue: selectedArray
        })
    }
    handleBack = () => {
        const task = this.props.navigation.getParam('propsData')
        const type = this.props.navigation.getParam('type')
        const id = this.props.navigation.getParam('id')
        const selectedValue = this.state.selectedValue
        this.props.updateCustomFields(task, id, selectedValue, type)
        this.props.navigation.goBack()
    }

    render() {
        const { navigation } = this.props
        const task = this.props.navigation.getParam('propsData')
        const project = gd.session.projects.get(task.projectId);
        const headerBg = '#' + gd.const.project.color[project.color];
        console.log(this.state.selectedValue)
        return (
            <StyleProvider style={getTheme(theme)}>
                <Container>
                    <ColorHeader noShadow noBottomBorder style={{ backgroundColor: headerBg }}>
                        <Left>
                            <Button transparent onPress={() => this.handleBack()}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title ellipsizeMode="head">{'Custom Field Name'}</Title>
                        </Body>
                        <Right>
                            {/* <Button transparent onPress={this.handleRefresh}>
                                <Icon name="refresh" {...iconProps                                                                                                                                                                                                                              Add} />
                            </Button> */}
                        </Right>
                    </ColorHeader>
                    <ScrollView>
                        {this.state.fieldNameValue.map((res, index) =>
                            <ListItem key={index} style={ListStyle} >
                                {this.state.selectedValue && this.state.selectedValue.indexOf(res.id) !== -1 &&
                                    <View style={switchStyle}>
                                        <Text>{res.value}</Text>
                                        <Switch
                                            height={27}
                                            width={45}
                                            onSyncPress={() => this.selectedDropdown(res.id)} value={true} />
                                    </View>
                                }
                                {this.state.selectedValue && this.state.selectedValue.indexOf(res.id) === -1
                                    &&
                                    <View style={switchStyle}>
                                        <Text>{res.value}</Text><Switch
                                            height={27}
                                            width={45}
                                            onSyncPress={() => this.selectedDropdown(res.id)} value={false} />
                                    </View>
                                }
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
const switchStyle = {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between'
}
export default connect(null, { updateCustomFields })(MultiValues)