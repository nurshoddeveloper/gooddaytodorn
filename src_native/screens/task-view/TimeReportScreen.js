import React, { Component } from 'react'
import {
    Text, ListItem, View, Row
} from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native'
import Moment from 'moment'
import UserIcon from '../../components/icon/user-icon';
import _ from 'lodash';

export default class showTimeReportScreen extends Component {
    constructor(props) {
        super(props);
    }
    formatDate(date) {
        var currentDate = Moment(date).format('MMM DD');
        return currentDate
    }
    timeConvert = (num) => {
        var hours = Math.floor(num / 60);
        var minutes = num % 60;
        return (hours) + "h" + ":" + (minutes) + "m";
    }

    totalTasksTime = (task) => {
        var totalTime = 0;
        task.timeReports.map((item, key) => {
            totalTime += item.reportedTime
        })
        return this.timeConvert(totalTime)
    }

    fetchMessage(messageId, messagesList) {
        var messageVal = '';
        messagesList.map((message) => {
            if (messageId === message.id) {
                messageVal = message.message;
            }
        });
        return messageVal;
    }

    renderMessage(taskMessageId, messages) {
        var message = this.fetchMessage(taskMessageId, messages);
        if (message && message.length > 0)
            return (
                <Text style={HeaderStyle2}>{message}</Text>
            );
    }

    renderTimeReport(item) {
        const { task, me } = this.props

        if (item.reportedTime !== null)
            return (
                <TouchableOpacity key={item.id}>
                    <ListItem style={ListStyle}>
                        <UserIcon user={gd.session.users.get(item.userId)} style={{ alignSelf: 'flex-start' }} />
                        <View style={nameContainerStyle}>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>{gd.session.users.get(item.userId).name}</Text>
                            <Text style={[HeaderStyle2]}>{this.formatDate(item.date)}</Text>
                            {this.renderMessage(item.taskMessageId, task.messages)}
                        </View>
                        <Row style={timeStyle}>
                            <Text style={HeaderStyle}>{this.timeConvert(item.reportedTime)}</Text>
                        </Row>
                    </ListItem>
                </TouchableOpacity>
            );
    }

    render() {
        const { task, me } = this.props
        const user = gd.session.users.get(me.id);

        return (
            <View style={mainContainer}>
                <ListItem style={ListHeaderStyle}>
                    <View style={{ flex: 1, alignItems: 'flex-start'}}>
                        <Text style={HeaderStyle2}>
                            Reported Time
                        </Text>
                    </View>
                    <Row style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Text style={HeaderStyle}>{task.timeReports ? this.totalTasksTime(task) : '0h:0m'}</Text>
                    </Row>
                </ListItem>
                <ScrollView>
                    {task.timeReports ? task.timeReports.map((item, key) => (
                        this.renderTimeReport(item)
                    )) : <View style={{ justifyContent: "center", flex: 1, marginTop: 200, alignItems: "center" }}>
                            <Text style={{ fontSize: 14, color: "gray" }}>No time reports found</Text>
                        </View>}
                </ScrollView>
            </View>

        )
    }
}

const mainContainer = {
    flex: 1
}
const HeaderStyle = {
    fontSize: 12,
    color: 'black',
}
const HeaderStyle2 = {
    fontSize: 12,
    color: 'gray',
}
const ListStyle = {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
}
const ListHeaderStyle = {
    height: 80,
    paddingLeft: 10,
    paddingRight: 10
}
const timeStyle = {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'flex-start'
}
const HeaderTimeStyle = {
    fontSize: 12,
}
const nameContainerStyle =
{
    flex:5,
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 0
}
const bottomContainer = {
    flex: 0.2,
    backgroundColor: "gray"
}