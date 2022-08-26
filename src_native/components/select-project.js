import React, { PureComponent } from 'react';
import { forEach as _forEach } from 'lodash';
import { Dimensions } from 'react-native';
import { Item, Button, Text } from 'native-base';
import theme from '../app-theme/variables/platform';
import ProjectIcon from './icon/project-icon';

export default class SelectProject extends PureComponent {
  render() {
    const { projectId } = this.props;
    return projectId ? this.renderValue() : this.renderRecent();
  }
  renderValue() {
    const { projectId, onPress } = this.props;
    const project = gd.session.projects.get(projectId);
    if (!project) return null;
    return (
      <Button transparent dark onPress={() => {onPress(project.id)}}>
        <ProjectIcon project={project} />
        <Text uppercase={false} numberOfLines={1} style={{fontSize:16, lineHeight:20}}>{project.name}</Text>
      </Button>
    )
  }
  renderRecent() {
    const { onPress } = this.props;
    let projects = gd.session.projects.filterNewTaskProjects();
    projects = projects.exportList();

    // reorder according to recents
    gd.session.recent.projects.getSorted().forEach(function(recent, recentKey) {
      _forEach(projects, function(p, key){
        if (p.value == recent.projectId) {
          projects.move(key, recentKey);
        }
      });
    });

    const iconsFit = parseInt((Dimensions.get('window').width-60) / (36+10));  // width - right icon more / icon width + marginRight
    //const iconsFit = parseInt((Dimensions.get('window').height - theme.toolbarHeight - 40) / (50+20));
    //console.log('width', width);
    //console.log('iconsFit', iconsFit);

    const recentProjects = projects.slice(0, iconsFit);
    if (!recentProjects) {
      console.warn('no recent projects');
      return null;
    }

    let out = [];

    recentProjects.map((m, key) => {
      //console.log('p', m.label, typeof m, Object.getOwnPropertyNames(m));
      out.push(<Button project-icon key={key} transparent onPress={() => {onPress(m.value)}}><ProjectIcon project={m.iconObj} /></Button>)
    });

    return <Item line-projects-users>{out}</Item>;
  }
}