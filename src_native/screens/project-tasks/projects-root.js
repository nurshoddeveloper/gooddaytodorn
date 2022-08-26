import React from 'react';
import _ from 'lodash';
import GDTree from '../../../src_web/src_web_changed/core/gd-ui/tree/gd-tree';


export default class ProjectsRoot extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    const { projectId, value, values, expanded } = props;
    const newExpanded = !projectId && !value && !values && !expanded ? {companies:[gd.getCurOrganizationId(true)]} : expanded;
    this.state = {
      expanded: newExpanded
    }
  }

  onChange({projectId, companyId}) {
    this.props.onPress(projectId, companyId);
  }

  render() {
    const { projectId, dontMarkSelectedProject, hideCompany } = this.props;

    const companyId = projectId ? gd.session.projects.get(projectId).companyId : null;

    const { expanded } = this.state;
    const companies = hideCompany ? [companyId] : null;
    const parentsFor = 'task';
    const value = {
      companyId,
      projectId
    };
    const viewMode = 'projects';

    let filterProjects = [];
    gd.session.projectUsers.map(pU=>{
      const project = gd.session.projects.get(pU.project.id);
      const hideTasks = companyId !== project.companyId && hideCompany
      if (pU.user.id === gd.session.me.id && project) {
        if (!hideTasks) {
          filterProjects.push({item: project})
        }
      }
    });
    filterProjects = _.uniq(filterProjects);

    const unselectLabel = null;
    const singleCompanyVisible = null;
    const showOnlyFilterProjects = true;
    const showProjectIcon = true;
    const scrollContentStyle = null;
    const multiselect = false;
    const accessLevels = null;

    return (
      <GDTree companies={companies}
              parentsFor={parentsFor}
              expanded={expanded}
              value={value}
              filterProjects={viewMode === "companies" ? [] : filterProjects}
              unselectLabel={unselectLabel}
              singleCompanyVisible={viewMode === "companies" || singleCompanyVisible}
              companiesSelectable={viewMode !== "projects"}
              showOnlyFilterProjects={viewMode === "companies" || showOnlyFilterProjects}
              showProjectIcon={showProjectIcon}
              scrollContentStyle={scrollContentStyle}
              multiselect={multiselect}
              accessLevels={accessLevels}
              onChange={this.onChange}
              dontMarkSelectedProject={dontMarkSelectedProject}
      />

    );
  }
}
