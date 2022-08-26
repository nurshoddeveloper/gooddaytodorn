import React, { PureComponent } from 'react';
import {
    Text, ListItem, View, Row, Icon, Button, Content
} from 'native-base';
import { TouchableOpacity, FlatList } from 'react-native'
import _ from 'lodash';
import UserIcon from '../../components/icon/user-icon';
import NewTaskControlsFields from './controls/new_task_control_field';
import { updateTaskArUser } from '../../redux/actions/task';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

class TaskInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false
        };
    }

    onActionRequiredPress = () => {
        const { task, me, actions } = this.props;
        var companyId = task.task.companyId;
        var projectId = task.task.projectId;
        var userId = me.id;
        this.props.navigation.navigate('select_user', { companyId, projectId, userId, onPress: this.selectUserFromList.bind(this), createTaskMode: true, task: task.task, onlyTaskUsers: true });
    }

    onActionItemPress(task, userId) {
        if (userId === 'no-ar') {
            userId = null;
        }
        this.props.action.updateTaskArUser(task, userId);

    }

    selectUserFromList(userId) {
        this.onActionItemPress(this.props.task.task, userId);
    }

    render() {
        const { task, me, actions } = this.props;
        var name = '';
        var user = {};
        if (task.task.actionRequiredUserId !== null) {
            user = gd.session.users.get(task.task.actionRequiredUserId);
            name = user.name
        } else
            name = "No action required"
        return (
            <Content scrollEnabled={true}>
                <ListItem style={ListStyle}>
                    <View style={{ flex: 1, alignItems: 'flex-start', }}>
                        <Text style={HeaderStyle}>
                            Action Required
                                </Text>
                        <TouchableOpacity>
                            <Text style={{ fontSize: 14, color: 'black', fontWeight: '500' }}>
                                {name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Row style={moreIconStyle}>
                        <UserIcon user={user} style={userProfile} />
                        <Button gd-button-round-more onPress={this.onActionRequiredPress} >
                            <Icon name="ios-more" />
                        </Button>
                    </Row>
                </ListItem>
                <NewTaskControlsFields task={task.task} actions={actions} me={me} />
            </Content>
        );
    }
}


const Stylecontainer = {
    // height : 650,
}
const ListStyle = {
    padding: 30,
}
const HeaderStyle = {
    fontSize: 15,
    color: 'gray',
    // marginVertical: 8
}
const userProfile = {
    marginRight: 10,
}
const moreIconStyle = {
    flex: 1,
    justifyContent: 'flex-end',
}

function mapStateToProps(state) {
    console.log(state)
    return {
        task: state.task,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        action: {
            updateTaskArUser: (task, userId) => dispatch(updateTaskArUser(task, userId)),
        }
    }
}
export default connect(
    mapStateToProps, mapDispatchToProps
)(withNavigation(TaskInfo));