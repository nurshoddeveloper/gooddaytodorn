import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Dimensions } from 'react-native';
import { Item, Button, Text } from 'native-base';
import TaskTypeIcon from './icon/task-type-icon';
import StructureControl from '../../src_web/src/core/gd/structure-control/structure-control';


export default class SelectType extends PureComponent {
  render() {
    const { projectId, typeId } = this.props;
    if (!projectId) return null;
    return typeId ? this.renderValue() : this.renderRecent();
  }
  renderValue() {
    const { typeId, onPress } = this.props;
    const taskType = gd.session.taskTypes.get(typeId);
    if (!taskType) return null;
    return (
      <Button transparent dark onPress={() => {onPress(taskType.id)}}>
        <TaskTypeIcon taskType={taskType}  />
        <Text uppercase={false} style={{fontSize:16, lineHeight:20}}>{taskType.name}</Text>
      </Button>
    )
  }
  renderRecent() {
    const { projectId, onPress } = this.props;

    let taskTypes = [];
    let companyId = null;

    const project = gd.session.projects.get(projectId);
    if (project) companyId = project.companyId;

    if (companyId) {
      const allTaskTypesOptions = gd.session.taskTypes.filterByCompany(companyId).exportOptions();
      taskTypes = _.orderBy(
          StructureControl.getTaskTypes(projectId, {exportToOptions: true}),
          [o => _.findIndex(allTaskTypesOptions, to => to.value === o.value)],
          ['asc']
      );
    }

    //console.log('taskTypes', taskTypes);

    const iconsFit = parseInt((Dimensions.get('window').width-60) / (36+10));  // width - right icon more / icon width + marginRight

    const recentTypes = taskTypes.slice(0, iconsFit);
    if (!recentTypes) {
      console.warn('SelectType: no recent types');
      return null;
    }

    let out = [];

    recentTypes.map((m, key) => {
      out.push(<Button project-icon key={key} transparent onPress={() => {onPress(m.value)}}><TaskTypeIcon taskType={m} /></Button>)
    });

    return <Item line-projects-users>{out}</Item>;
  }
}