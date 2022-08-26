import React from 'react';
import _ from 'lodash';
import {
  StyleProvider, Container, Header, Content,
  Title, Button, Left, Body, Right, Icon, Text
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import GDTree from '../../../src_web/src_web_changed/core/gd-ui/tree/gd-tree';


export default class SelectProjectScreen extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    const { projectId, value, values, expanded } = props.navigation.state.params;
    const newExpanded = !projectId && !value && !values && !expanded ? {companies:[gd.getCurOrganizationId(true)]} : expanded;
    this.state = {
      expanded: newExpanded
    }
  }

  onChange({projectId, companyId}) {
    const { navigation } = this.props;
    const { onPress } = navigation.state.params;
    onPress(projectId);
    navigation.goBack();
  }

  render() {
    const { navigation } = this.props;
    const { projectId } = navigation.state.params;

    //const { projectId } = this.props;
    const companyId = projectId ? gd.session.projects.get(projectId).companyId : null;

    const { expanded } = this.state;
    const companies = null;
    const parentsFor = 'task';
    const value = {
      companyId,
      projectId
    };
    const viewMode = 'projects';

    let filterProjects = [];
    gd.session.projectUsers.map(pU=>{
      const project = gd.session.projects.get(pU.project.id);
      if (pU.user.id === gd.session.me.id && project) filterProjects.push({item: project})
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
      <StyleProvider style={getTheme(theme)}>
        <Container>
          <ColorHeader>
            <Left>
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Select project</Title>
            </Body>
            <Right />
          </ColorHeader>
          <Content content-projects-tree>
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
                    onChange={this.onChange} />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
