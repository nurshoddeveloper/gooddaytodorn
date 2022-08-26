import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Item, Button, Text } from 'native-base';
import UserIcon from './icon/user-icon';
import { AR_NO_ACTION_REQUIRED } from '../common/constants';
import { createNoArUser } from '../common/utils';


export default class SelectUser extends PureComponent {
  render() {
    const { projectId, userId } = this.props;
    if (!projectId) return null;
    return userId ? this.renderValue() : this.renderRecent();
  }
  renderValue() {
    const { userId, onPress, createTaskMode } = this.props;
    const user = gd.session.users.get(userId) || createNoArUser(createTaskMode);
    return (
      <Button transparent dark onPress={() => {
        onPress(user.id)
      }}>
        <UserIcon user={user}/>
        <Text uppercase={false} style={{fontSize: 16, lineHeight: 20}}>{user.name}</Text>
      </Button>
    )
  }
  renderRecent() {
    const { taskUsers, projectId, onPress, createTaskMode } = this.props;

    let recentUsers = [];
    let projectUsers = [];
    let companyId = null;

    if (taskUsers && taskUsers.length > 0) {
      recentUsers = exportTaskUsersToOptions(taskUsers);
    } else if (projectId) {
      const project = gd.session.projects.get(projectId);
      if (project) companyId = project.companyId;
      if (companyId) {
        projectUsers = gd.session.projectUsers.filterByProject(projectId).exportToOptions();
      }
      recentUsers = projectUsers;
    }

    let iconsFit = parseInt((Dimensions.get('window').width-60) / (36+10)) - 3;  // width - right icon more / icon width - no-ar-user button
    if (iconsFit < 3) iconsFit = 3;

    recentUsers = recentUsers.slice(0, iconsFit);
    if (!recentUsers) {
      console.warn('SelectUser: no recent users');
      //return null;
    }

    const out = [];
    recentUsers.map((m, key) => {
      out.push(<Button project-icon key={key} transparent onPress={() => {onPress(m.value)}}><UserIcon user={m.iconObj} /></Button>)
    });

    const noArUserTitle = createTaskMode ? 'Not assigned' : 'No action required';
    out.push(<Button project-icon key="key-noar" transparent onPress={() => {onPress(AR_NO_ACTION_REQUIRED)}}><Text no-ar uppercase={false} style={styles.title}>{noArUserTitle}</Text></Button>);

    return <Item line-projects-users>{out}</Item>;
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#030303',
    fontSize: 13,
    fontFamily: 'OpenSans-Regular'
  }
})


function exportTaskUsersToOptions(models) {
  const result = [];
  models.map(m => {
    result.push({
      value: m.id,
      label: m.name,
      icon: m.icon,
      iconObj: m
    })
  });

  return result;
}
