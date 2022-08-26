import React, { Component } from 'react';
import { Dimensions, Linking, Image, TouchableOpacity } from 'react-native';
import {
    Text, Row, View, ListItem, Icon, Button
} from 'native-base';
import Moment from 'moment';
import theme from '../../../app-theme/variables/platform';
import TaskPriorityIcon from '../../../components/icon/task-priority-icon';
import ProgressBar from '../../../components/progress-bar';
import { getGlyphByName } from '../../../common/icons';
import { withNavigation } from 'react-navigation'
import _ from 'lodash';
import { updateCustomFields, } from '../../../redux/actions/task'
import { connect } from 'react-redux';
import moment from 'moment';
import UserIcon from '../../../components/icon/user-icon';
import FeatherIcon from 'react-native-vector-icons/FontAwesome'
import Switch from 'react-native-switch-pro'
import StarRating from 'react-native-star-rating';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons'

const email = require('../../../../assets/icons/mail.png')
const percentage = require('../../../../assets/icons/percent.png')
const AmountArray = [
    { name: "us_dollar", value: "$" },
    { name: "euro", value: "€" },
    { name: "pound_sterling", value: "£" },
    { name: "australian_dollar", value: "$" },
    { name: "arab_emirates_dirham", value: "dh" },
    { name: "Argentine_Peso", value: "$" },
    { name: "Brazilian_Real", value: "R$" },
    { name: "Canadian_Dollar", value: "$" },
    { name: "Chilean_Peso", value: "$" },
    { name: "Colombian_Peso", value: "$" },
    { name: "Czech_Koruna", value: "Kč" },
    { name: "Danish_Krone", value: "kr" },
    { name: "Hong_Kong_Dollar", value: "HK$" },
    { name: "Hungarian_Forint", value: "Ft" },
    { name: "Indian_Rupee", value: "₹" },
    { name: "Indonesian_Rupiah", value: "Rp" },
    { name: "Israeli_New_Shekel", value: "₪" },
    { name: "Japanese_Yen", value: "¥" },
    { name: "Korean_Won", value: "₩" },
    { name: "Malaysian_Ringgit", value: "RM" },
    { name: "Mexican_Peso", value: "$" },
    { name: "New_Zealand_Dollar", value: "$" },
    { name: "Norwegian_Krone", value: "kr" },
    { name: "Peruvian_Nuevo_Sol", value: "S /." },
    { name: "Philippine_Peso", value: "₱" },
    { name: "Polish_Zloty", value: "zł" },
    { name: "Romanian_New_Leu", value: "lei" },
    { name: "Russian_Ruble", value: "руб." },
    { name: "Saudi_Riyal", value: "Rial" },
    { name: "Singapore_Dollar", value: "$" },
    { name: "South_African_Rand", value: "R" },
    { name: "Swedish_Krona", value: "kr" },
    { name: "Swiss_Franc", value: "CHF" },
    { name: "Taiwan_Dollar", value: "NT$" },
    { name: "Thai_Baht", value: "฿" },
    { name: "Turkish_Lira", value: "TRY" },
    { name: "Ukraine_Hryvnia", value: "₴" },
    { name: "Vietnamese_Dong", value: "₫" },
    { name: "Yuan_Renminbi", value: "¥" },
]
class NewTaskControlsFields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateId: '',
            dateType: '',
            customFields: [],
            customFieldsData: []
        }
    }
    // componentDidMount() {
    //     const { task } = this.props
    //     const customFields = this.getCustomFields();
    //     if (customFields.length <= 0) return false;
    //     this.setState({
    //         customFields: customFields
    //     })
    // }
    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleUrl);
    }
    selectStartDate = (startDate) => {
        const { task } = this.props;
        const { dateId, dateType } = this.state
        const formatDate = moment(startDate).format('YYYY-MM-DD')
        this.props.updateCustomFields(task, dateId, formatDate, dateType);

    }
    selectUserFromList = (userId) => {
        const { task } = this.props
        const { dateId, dateType } = this.state
        this.props.updateCustomFields(task, dateId, userId, dateType)
    }
    handleUrl = (url) => {
        if (url.includes('https' && 'http') ) {
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (!supported) {
                    } else {
                        return Linking.openURL(url);
                    }
                })
                .catch((err) => console.log('An log occurred', err));
        }
        else {
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (!supported) {
                        console.log("Can't handle url: " + url);
                    } else {
                        return Linking.openURL(`https://${url}`);

                    }
                })
                .catch((err) => console.log('An log occurred', err));
        }
}
navigatingRoutes = (navigationType, props, id, value, fieldNameValue, ratingsType, symbol) => {
    switch (navigationType) {
        case 1:
            return this.props.navigation.navigate('textbox', { propsData: props, id: id, value: value, type: 'string' })
        case 3:
            return this.props.navigation.navigate('numberfield', { propsData: props, id: id, value: value, type: 'float' })
        case 4:
            return this.props.navigation.navigate('amountfield', { propsData: props, id: id, value: value, type: 'float', symbol: ratingsType })
        case 5:
            return this.props.navigation.navigate('percentagefield', { propsData: props, id: id, value: value, type: 'float' })
        case 6:
            this.setState({ dateId: id, dateType: 'string' })
            return this.props.navigation.navigate('select_date', { minDate: null, onPress: this.selectStartDate, title: 'Select date' })
        case 7:
            return this.props.navigation.navigate('dropdown', { propsData: props, id: id, value: value, type: 'float', fieldNameValue: fieldNameValue })
        case 8:
            return this.props.navigation.navigate('rating', { propsData: props, id: id, value: value, type: 'float', ratingsType })
        case 9:
            return this.props.navigation.navigate('emailField', { propsData: props, id: id, value: value, type: 'string' })
        case 10:
            return this.props.navigation.navigate('phonefield', { propsData: props, id: id, value: value, type: 'string' })
        case 11:
            return this.props.navigation.navigate('linkfield', { propsData: props, id: id, value: value, type: 'string', })
        case 12:
            const { task, me } = this.props;
            var companyId = task.companyId;
            var projectId = task.projectId;
            var userId = me.id;
            this.setState({ dateId: id, dateType: 'string' })
            return this.props.navigation.navigate('select_user', { companyId, projectId, userId, onPress: this.selectUserFromList, task: task, createTaskMode: false, })
        case 13:
            return this.props.navigation.navigate('textbox', { propsData: props, id: id, value: value, type: 'string' })
        case 14:
            return this.props.navigation.navigate('multifields', { propsData: props, id: id, value: value, type: 'json', fieldNameValue: fieldNameValue })
        default:
            return navigationType;
    }
}
getCustomFields = () => {
    const { task } = this.props
    const taskType = gd.session.taskTypes.get(task.taskTypeId);
    const taskTypeCustomFields = taskType.customFields.map(id => gd.session.customFields.get(id));
    const project = gd.session.projects.get(task.projectId);
    let projectCustomFields = project.customFields.map(id => gd.session.customFields.get(id));
    const parentProjects = gd.tree.findProjectParents(gd.tree.getProject(task.projectId)).map(p => p.id);
    parentProjects && parentProjects.map(pId => {
        const project = gd.session.projects.get(pId);
        if (project) projectCustomFields = projectCustomFields.concat(project.customFields.map(id => gd.session.customFields.get(id)));
    });
    let customFields = _.union(projectCustomFields, taskTypeCustomFields);
    const { EVERYONE, MANAGERS_ONLY } = gd.const.customFields.access;
    const accessLevels = gd.ac.check.project.fullAccess(task.projectId) ? [EVERYONE, MANAGERS_ONLY] : [EVERYONE];
    customFields = _.filter(customFields, (cf) => accessLevels.indexOf(cf ? cf.access : undefined) > -1);
    return customFields
};
ChangeValue = (value, id, type) => {
    const { task } = this.props
    this.setState({
        valueItem: value
    })
    this.props.updateCustomFields(task, id, value, type);
}
render() {
    const { task, actions, me, navigation } = this.props;
    // const { customFields } = this.state
    const priorityName = gd.session.companies.get(task.companyId).priorities['priority' + task.priority];

    let progressText = '-';
    let showProgress = false;
    let progressBarWidth = 0;
    if (task.progress > 0 || task.progress === 0) {
        progressText = task.progress + '%';
        showProgress = true;
        const ww = Dimensions.get('window').width;
        progressBarWidth = ww - 230;
        if (progressBarWidth < 30) progressBarWidth = 30;
    }

    let startDateText = '';
    let endDateText = '';
    if (task.startDate) startDateText = gd.utils.momentHumanize(task.startDate, 'MMM, DD');
    if (task.endDate) endDateText = gd.utils.momentHumanize(task.endDate, 'MMM, DD');
    const haveStartEnd = startDateText != '' && endDateText != '';

    let deadlineText = '-';
    let scheduleDate = '-';
    const deadlineAdd = {};
    if (task.deadline) {
        deadlineText = gd.utils.momentHumanize(task.deadline, 'MMM, DD');
        if (task.deadline.isBefore(Moment(), 'days')) {
            deadlineAdd['gd-schedule-past'] = true;
        }
    }

    let estimateText = '-';
    if (task.estimate) {
        estimateText = gd.utils.minutesHumanize(task.estimate);
    }

    const glyphMore = String.fromCharCode(getGlyphByName('more'));

    let scheduleName = '-';
    const scheduleAdd = {};
    const showSchedule = task.isOpen && (task.actionRequiredUserId && task.actionRequiredUserId == gd.session.me.id);
    if (showSchedule) {
        if (task.scheduleStatus == gd.const.task.scheduleStatus.SOMEDAY) {
            scheduleName = 'Someday';
        }

        if (task.scheduleStatus == gd.const.task.scheduleStatus.SCHEDULED) {
            scheduleName = gd.utils.momentHumanize(task.scheduleDate, 'MMM, DD');
            if (task.scheduleDate && task.scheduleDate.isBefore(Moment(), 'days')) {
                scheduleAdd['gd-schedule-past'] = true;
            }
        }
    }
    const customFields = this.getCustomFields();
    let customFieldsData = {};
    if (task && task.customFieldsData) {
        customFieldsData = task.customFieldsData
    }

    console.log(customFieldsData, "customFieldsData")
    console.log(this.state.customFields, "customFields")
    return (
        <View style={styleControlsExpanded}>
            <ListItem style={ListStyle} askExtraFieldItem button={true} onPress={actions.openSelectScheduleScreen}>
                <View style={{ flex: 1, alignItems: 'flex-start', }}>
                    <Text style={HeaderStyle}>
                        Schedule
                    </Text>
                    <Row>
                        <Text numberOfLines={1} style={{ fontSize: 14, color: 'black', }} {...scheduleAdd}>
                            {scheduleName}
                        </Text>
                    </Row>
                </View>
                <Button gd-button-round-more onPress={actions.openSelectScheduleScreen} >
                    <Icon name="ios-more" />
                </Button>
            </ListItem>

            {task.isOpen &&
                <ListItem style={ListStyle} onPress={actions.openSelectPriorityScreen}>
                    <View style={{ flex: 1, alignItems: 'flex-start', }}>
                        <Text style={HeaderStyle}>
                            Priority
                        </Text>
                        <Row>
                            <TaskPriorityIcon priority={task.priority} tiny />
                            <Text numberOfLines={1} style={{ fontSize: 14, color: 'black', }}>
                                {priorityName}
                            </Text>
                        </Row>
                    </View>
                    <Button gd-button-round-more onPress={actions.openSelectPriorityScreen} >
                        <Icon name="ios-more" />
                    </Button>
                </ListItem>
            }
            <ListItem style={ListStyle} askExtraFieldItem button={true} onPress={actions.openSelectDeadlineScreen}>
                <View style={{ flex: 1, alignItems: 'flex-start', }}>
                    <Text style={HeaderStyle}>
                        Deadline
                        </Text>
                    <Row>
                        <Text numberOfLines={1} {...deadlineAdd} style={{ fontSize: 14, color: 'black', }}>
                            {deadlineText}
                        </Text>
                    </Row>
                </View>
                <Button gd-button-round-more onPress={actions.openSelectDeadlineScreen} >
                    <Icon name="ios-more" />
                </Button>
            </ListItem>
            <ListItem style={ListStyle} askExtraFieldItem button={true} onPress={actions.openSelectStartDateScreen}>
                <View style={{ flex: 1, alignItems: 'flex-start', }}>
                    <Text style={HeaderStyle}>
                        Start - End
                    </Text>
                    {haveStartEnd
                        ?
                        <Row>
                            <Text style={{ fontSize: 14, color: 'black', }} numberOfLines={1}>
                                {startDateText}
                            </Text>
                            <Text numberOfLines={1}> - </Text>
                            <Text style={{ fontSize: 14, color: 'black', }} numberOfLines={1} onPress={actions.openSelectStartDateScreen}>
                                {endDateText}
                            </Text>
                        </Row>
                        :
                        <Row tefi-start-end-dates>
                            <Text numberOfLines={1}>-</Text>
                        </Row>
                    }
                </View>
                <Button gd-button-round-more onPress={actions.openSelectStartDateScreen} >
                    <Icon name="ios-more" />
                </Button>
            </ListItem>
            <ListItem style={ListStyle} askExtraFieldItem button={true} onPress={actions.openSelectProgressScreen}>
                <View style={{ flex: 1, alignItems: 'flex-start', }}>
                    <Text style={HeaderStyle}>
                        Progress
                     </Text>
                    <Row>
                        {showProgress &&
                            <ProgressBar width={progressBarWidth} progress={task.progress} style={{ alignSelf: 'center', marginRight: 8 }} />
                        }
                        <Text style={{ fontSize: 14, color: 'black', }} style={{ marginLeft: 10 }} numberOfLines={1}>{task.progress ? task.progress + '%' : ''}</Text></Row>
                </View>
                <Button gd-button-round-more onPress={actions.openSelectProgressScreen} >
                    <Icon name="ios-more" />
                </Button>
            </ListItem>

            {customFields.length ? customFields.map((cf, index) => {
                const fieldValue = customFieldsData[cf.id];
                const title = cf && cf.name + ":"
                const fieldNameValue = cf.params && cf.params.listItems
                const ratingsType = cf.params && cf.params.ratingType
                const symbol = cf.params && cf.params.symbol
                const result = symbol !== '' ? AmountArray.find(({ name }) => (name).toLowerCase() === symbol) : '';
                // for Checkbox
                if (cf.type === 2) {
                    return <ListItem key={index} style={ListStyle} >
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: '2%', alignItems: 'center' }}>
                            <Text>{title}</Text>
                            <Switch
                                value={fieldValue}
                                onSyncPress={() => this.ChangeValue(!fieldValue, cf.id, 'boolean')}
                                height={27}
                                width={45}
                            />
                        </View>
                    </ListItem>
                }
                //for currency
                else if (cf.type === 4) {
                    return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue, symbol)} >
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={HeaderStyle}>
                                {title}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {fieldValue === null || fieldValue === undefined ? <></> : <Text>{result.value}</Text>}
                                <Text key={cf.id} style={{ fontSize: 14, color: 'black', marginLeft: 7 }}>
                                    {fieldValue}
                                </Text>
                            </View>
                        </View>
                        <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue, symbol)}>
                            <Icon name="ios-more" />
                        </Button>
                    </ListItem>
                }
                // for percentage
                else if (cf.type === 5) {
                    return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)} >
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={HeaderStyle}>
                                {title}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {fieldValue === null || fieldValue === undefined ? <></> : <Image source={percentage} style={{ height: 12, width: 12, tintColor: '#565656' }} />}
                                <Text key={cf.id} style={{ fontSize: 14, color: 'black', marginLeft: 7 }}>
                                    {fieldValue}
                                </Text>
                            </View>
                        </View>
                        <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)}>
                            <Icon name="ios-more" />
                        </Button>
                    </ListItem>
                }
                //for dropdown
                else if (cf.type === 7) {
                    const d = fieldNameValue
                    return <View key={index}>
                        {d.map((r, index) => {
                            if (r.id === fieldValue) {
                                return <ListItem key={'mykey' + index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)} >
                                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                        <Text style={HeaderStyle}>
                                            {title}
                                        </Text>
                                        <Text style={{ fontSize: 14, color: 'black', }}>
                                            {r.value}
                                        </Text>
                                    </View>
                                    <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)}>
                                        <Icon name="ios-more" />
                                    </Button>
                                </ListItem>
                            }
                        })}
                    </View>
                }// for rating
                else if (cf.type === 8) {
                    if (ratingsType === 3) {
                        return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue, ratingsType)} >
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <Text style={HeaderStyle}>
                                    {title}
                                </Text>
                                {fieldValue === null || fieldValue === undefined ? <></> :
                                    <StarRating
                                        disabled={true}
                                        emptyStar={'star-o'}
                                        fullStar={'star'}
                                        iconSet={'FontAwesome'}
                                        maxStars={3}
                                        rating={fieldValue}
                                        fullStarColor={'#F2B953'}
                                        starStyle={{ marginHorizontal: 1, }}
                                        starSize={17}
                                        emptyStarColor={'#D3D2D7'}
                                    />}
                            </View>
                            <Button gd-button-round-more >
                                <Icon name="ios-more" onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue, ratingsType)} />
                            </Button>
                        </ListItem>
                    }
                    else {
                        return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue, ratingsType)} >
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <Text style={HeaderStyle}>
                                    {title}
                                </Text>
                                {fieldValue === null || fieldValue === undefined ? <></> :
                                    <StarRating
                                        disabled={true}
                                        emptyStar={'star-o'}
                                        fullStar={'star'}
                                        iconSet={'FontAwesome'}
                                        maxStars={5}
                                        rating={fieldValue}
                                        fullStarColor={'#F2B953'}
                                        starStyle={{ marginHorizontal: 1, }}
                                        starSize={17}
                                        emptyStarColor={'#D3D2D7'}
                                    />}
                            </View>
                            <Button gd-button-round-more >
                                <Icon name="ios-more" onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue, ratingsType)} />
                            </Button>
                        </ListItem>
                    }
                }
                //for email
                else if (cf.type === 9) {
                    return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)} >
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={HeaderStyle}>
                                {title}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {fieldValue === null || fieldValue === undefined ? <></> : <Image source={email} style={{ height: 17, width: 17, tintColor: "#565656" }} />}
                                <Text style={{ fontSize: 14, color: 'black', marginLeft: 7 }}>
                                    {fieldValue}
                                </Text>
                            </View>
                        </View>
                        <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)}>
                            <Icon name="ios-more" />
                        </Button>
                    </ListItem>
                }
                // for Phone
                else if (cf.type === 10) {
                    return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)} >
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={HeaderStyle}>
                                {title}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {fieldValue === null || fieldValue === undefined ? <></> : <FeatherIcon name='phone' size={15} color={"#565656"} />}
                                <Text key={cf.id} style={{ fontSize: 14, color: 'black', marginLeft: 7 }}>
                                    {fieldValue}
                                </Text>
                            </View>
                        </View>
                        <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)}>
                            <Icon name="ios-more" />
                        </Button>
                    </ListItem>
                }
                //for linking
                else if (cf.type === 11) {
                    return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)} >
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={HeaderStyle}>
                                {title}
                            </Text>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => this.handleUrl(fieldValue)} >
                                    <Text style={{ color: '#2677DA', }} >{fieldValue} </Text>
                                    {fieldValue === null || fieldValue === undefined ? <></> : <EvilIconsIcon name="external-link" size={22} color='#2677DA' style={{ marginTop: '0.5%' }} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)}>
                            <Icon name="ios-more" />
                        </Button>
                    </ListItem>
                }
                //Select User
                else if (cf.type === 12) {
                    var name = '';
                    var user = {};
                    if (fieldValue !== 'no-ar' && fieldValue !== undefined) {
                        user = gd.session.users.get(fieldValue);
                        name = user.name
                    } else {
                        name = ""
                    }
                    return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue)} >
                        <View style={{ flex: 1, alignItems: 'flex-start', }}>
                            <Text style={HeaderStyle}>
                                {title}
                            </Text>
                            <Text style={{ fontSize: 14, color: 'black', fontWeight: '500' }}>
                                {name}
                            </Text>
                        </View>
                        <Row style={moreIconStyle}>
                            {name === '' ? <></> : <UserIcon user={user} style={userProfile} />}
                            <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue)} >
                                <Icon name="ios-more" />
                            </Button>
                        </Row>
                    </ListItem>
                }
                // for MultiSelect
                else if (cf.type === 14) {
                    const d = fieldNameValue
                    const multiSelectData = []
                    if (fieldValue) {
                        for (i = 0; i <= fieldValue.length; i++) {
                            const value = d.filter(v => v.id === fieldValue[i]);
                            multiSelectData.push(...value)
                        }
                    }

                    return <ListItem key={index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)} >
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={HeaderStyle}>
                                {title}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {multiSelectData && multiSelectData.map((val, index) => {
                                    if (multiSelectData.length - 1 === index)
                                        return <Text numberOfLines={3} key={index} style={{ fontSize: 14, color: 'black', }}>{val.value}</Text>
                                    else
                                        return <Text numberOfLines={3} key={index} style={{ fontSize: 14, color: 'black', }}>{val.value + ','}</Text>
                                })}
                            </View>
                        </View>
                        <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)}>
                            <Icon name="ios-more" />
                        </Button>
                    </ListItem>
                }
                else {
                    return <ListItem key={'mykey' + index} style={ListStyle} onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)} >
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={HeaderStyle}>
                                {title}
                            </Text>
                            <Text key={cf.id} style={{ fontSize: 14, color: 'black', }} numberOfLines={3}  >
                                {fieldValue}
                            </Text>
                        </View>
                        <Button gd-button-round-more onPress={() => this.navigatingRoutes(cf.type, this.props.task, cf.id, fieldValue, fieldNameValue)}>
                            <Icon name="ios-more" />
                        </Button>
                    </ListItem>

                }
            }) : <></>}
        </View >
    );
}
}

const styleControlsExpanded = {
    borderBottomWidth: theme.borderWidth,
    borderColor: theme.cardBorderColor,
};
const ListStyle = {
    padding: 30,
}
const HeaderStyle = {
    fontSize: 14,
    color: 'gray',
    // marginVertical: 8
}
const moreIconStyle = {
    flex: 1,
    justifyContent: 'flex-end',
}
const userProfile = {
    marginRight: 10,
}


export default withNavigation(connect(null, { updateCustomFields })(NewTaskControlsFields))
