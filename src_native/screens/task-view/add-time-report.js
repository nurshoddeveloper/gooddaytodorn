import React, { Component } from 'react'
import ColorHeader from '../../components/color-header'
import { connect } from 'react-redux'
import {
    StyleProvider, Container, ListItem, Item,
    Body, Left, Right, Icon, Text, Button,
    Grid, Row, Textarea, View,
} from 'native-base';
import { addtimereport } from '../../redux/actions/add-time-report'

import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import TaskTypeIcon from '../../components/icon/task-type-icon';
import { getGlyphByName } from '../../common/icons';

// Time Picker and Date Picker Library
import TimePicker from "react-native-24h-timepicker";
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';


const styleError = { paddingLeft: theme.listItemPadding, paddingVertical: 5, marginLeft: -10 };
const styleErrors = { paddingLeft: theme.listItemPadding, paddingTop: 5, marginLeft: 6 };

class AddTimeReport extends Component {
    constructor(props) {
        super(props);

        this.date = Moment(new Date()).format('YYYY-MM-DD');

        this.state = {
            reportedDate: this.date,
            reportedTime: '',
            comment: "",
            errors: {}
        };
    }

    setDate = newDate => {
        this.setState({ reportedDate: newDate });
    }

    onCancel() {
        this.TimePicker.close();
    }

    timeConvert = (num) => {
        var hours = Math.floor(num / 60);
        var minutes = num % 60;
        return (hours) + "h" + ":" + (minutes) + "m";
    }

    onConfirm = (hour, minute) => {
        this.setState({ reportedTime: (parseInt(hour) * 60) + parseInt(minute) });
        this.TimePicker.close();
    }

    formatDate = (date) => {
        const d = date;
        return d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
    }

    validateForm = () => {

        const { reportedDate, reportedTime } = this.state;
        let errors = {};
        let formIsValid = true;

        if (!reportedDate) {
            formIsValid = false
            errors['reportedDate'] = "Select The Time Reported Date"
        }
        if (!reportedTime) {
            formIsValid = false
            errors['reportedTime'] = "Select the Reported Time"
        }
        this.setState({
            errors: errors
        });
        return formIsValid;
    }

    handleSubmit = () => {
        const addReportData = {
            date: this.state.reportedDate,
            message: this.state.comment,
            reportedMinutes: this.state.reportedTime,
            taskId: this.props.task.task.id,
            zz: "+0530"
        }
        if (this.validateForm()) {
            this.props.actions.addtimereport(addReportData)
            this.props.navigation.goBack()
        }
    }

    render() {

        var today = new Date();
        // var currentDate = Moment(today).format('MMM DD, YYYY');

        const { task, navigation } = this.props;
        const glyphMore = String.fromCharCode(getGlyphByName('more'));

        let row2Height = 25;
        let row2MarginTop = -10;
        if (theme.platform == 'ios') {
            row2Height = 15;
            row2MarginTop = -20;
        }
        const backIconAdd = {};
        if (theme.platform == 'ios') {
            backIconAdd.style = { color: '#ffffff' };
        }
        return (
            <StyleProvider style={getTheme(theme)}>
                <Container>
                    <ColorHeader style={{ height: theme.toolbarHeight + row2Height }}>
                        <Grid>
                            <Row style={{ height: theme.toolbarHeight }}>
                                <Left>
                                    <Button transparent onPress={() => navigation.goBack()}>
                                        <Icon name="arrow-back" {...backIconAdd} />
                                    </Button>
                                </Left>
                                <Body>
                                    <Item task-title-icon><TaskTypeIcon inHeader /><Text numberOfLines={1}>{'New Time Report'}</Text></Item>
                                </Body>
                                <Right />
                            </Row>
                        </Grid>
                    </ColorHeader>

                    <View style={{ flex: 1 }}>

                        <ListItem style={ListStyle}>
                            <View style={{ width: '100%', }}>
                                <Text style={HeaderStyle}>
                                    Reported Date
                                </Text>
                                <DatePicker
                                    ref={(ref) => this.datePickerRef = ref}
                                    style={{ height: 40, width: "100%", flex: 1, justifyContent: "center", marginVertical: 7 }}
                                    date={this.state.reportedDate}
                                    mode="date"
                                    placeholder="Select Date"
                                    format="YYYY-MM-DD"
                                    minDate="2018,01,01"
                                    maxDate={today}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={false}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            borderColor: 0,
                                            flex: 1,
                                            alignItems: "flex-start"
                                        },
                                        dateText: {
                                            fontSize: 14,
                                            color: 'black',
                                        },
                                        placeholderText: {
                                            fontSize: 14,
                                            color: 'black',
                                        },
                                        btnTextConfirm: {
                                            color: '#0B6EAD'
                                        }
                                    }}
                                    onDateChange={this.setDate}
                                />
                                <Item style={styleError} error-create-task><Text>{this.state.errors.reportedDate}</Text></Item>
                            </View>
                            <Row style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Button gd-button-round-more onPress={() => this.datePickerRef.onPressDate()} >
                                    <Icon name="ios-more" />
                                </Button>
                            </Row>

                        </ListItem>


                        <ListItem style={ListStyle}>
                            <View style={{ width: '100%' }}>
                                <Text style={HeaderStyle}>
                                    Time
                                </Text>
                                <Text onPress={() => this.TimePicker.open()} style={subHeaderStyle}>
                                    {this.state.reportedTime ? this.timeConvert(this.state.reportedTime) : 'Select Time'}
                                </Text>
                                <TimePicker
                                    ref={ref => {
                                        this.TimePicker = ref;
                                    }}
                                    onCancel={() => this.onCancel()}
                                    onConfirm={this.onConfirm}
                                />
                                <Item style={styleError} error-create-task><Text>{this.state.errors.reportedTime}</Text></Item>
                            </View>
                            <Row style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Button gd-button-round-more onPress={() => this.TimePicker.open()}>
                                    <Icon name="ios-more" />
                                </Button>
                            </Row>
                        </ListItem>

                        <ListItem>
                            <Textarea onChangeText={(text) => this.setState({ comment: text })} style={{ borderWidth: 0, borderColor: 0, marginLeft: 10, width: "100%" }} rowSpan={4} bordered placeholder="Comment" placeholderTextColor="black" />
                        </ListItem>
                        <Item style={styleErrors} error-create-task><Text>{this.state.errors.comment}</Text></Item>
                        <ListItem noBorder>
                            <Body style={{ paddingLeft: theme.listItemPadding, justifyContent: 'center' }}>
                                <Button onPress={this.handleSubmit} block>
                                    <Text>Submit</Text>
                                </Button>
                            </Body>
                        </ListItem>
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}
const ListStyle = {
    padding: 20,
    height: 80
}
const HeaderStyle = {
    fontSize: 14,
    color: 'gray',
    marginVertical: 10
}
const subHeaderStyle = {
    fontSize: 14,
    color: 'black',
}
const ErrorMessage = {
    alignSelf: 'center',
    color: 'red',
    // marginVertical : 5
}

function mapStateToProps(state) {
    console.log(state)
    return {
        task: state.task,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            addtimereport: (reportedDate, reportedTime) => dispatch(addtimereport(reportedDate, reportedTime)),
        }
    }
}
export default connect(
    mapStateToProps, mapDispatchToProps
)(AddTimeReport);