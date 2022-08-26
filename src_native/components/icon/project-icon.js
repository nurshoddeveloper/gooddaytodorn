import React from 'react';
import { Thumbnail, Badge, Text } from 'native-base';
import { getColorByClass } from '../../common/alphabet-colors';

export default function projectIcon(props) {
  const { project, onlyWithPhoto, style } = props;
  if (!project) return null;

  const add = {};
  if (style) add.style = {...style};

  if (!project.icon || project.icon == '_def.png') {

    if (onlyWithPhoto) return <Badge project-icon style={{backgroundColor:'transparent'}} />;

    // figure out short name please...
    let shortName;
    if (project.shortName) shortName = project.shortName;
    else if (project.initials) shortName = project.initials;
    else {
      console.error("project icon - something wrong with short name", project);
      shortName =  gd.utils.initials(project.name, 2);
    }
    //console.log('shortName', shortName);

    let colorClass;

    if (project.color) {
      colorClass = "gd-c-" + project.color;
    } else {
      const projectSession = gd.session.projects.get(project.id);
      if (projectSession && projectSession.color) {
        colorClass = "gd-c-" + projectSession.color;
      } else {
        colorClass = "gd-" + shortName.substr(0, 1).toLowerCase();
        console.error("project icon - something wrong with short name");
      }
    }
    //console.log('colorClass', colorClass);
    add.style = add.style || {};
    add.style.backgroundColor = getColorByClass(colorClass);

    return <Badge project-icon {...add}><Text numberOfLines={1}>{shortName}</Text></Badge>;

  } else {

    const piSrc = gdConfig.mediaPath + 'project/large/' + project.icon;
    return <Thumbnail small square source={{uri: piSrc}} {...add} />;
  }
}
