import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, InteractionManager, RefreshControl } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import _ from 'lodash';
import {
  StyleProvider, Container, Header, Title, Content,
  Grid, Row,
  Body, Left, Right,
  Icon, Text, Button,
} from 'native-base';
import getTheme from '../../app-theme/components';
import theme from '../../app-theme/variables/platform';
import ColorHeader from '../../components/color-header';
import LoadingContent from '../common/loading-content';
import { loadProjectTasks } from '../../redux/actions/project-tasks';
import { loadTask } from '../../redux/actions/task';
import ProjectsRoot from './projects-root';
import ProjectControls from './controls';
import ProjectsTasksList from './list/projects-tasks-list';
import TaskListCollection  from '../../../src_web/src/core/gd-model/task-list/task-list-collection';
import TaskStatusManager from '../../../src_web/src/core/gd/manager/task-status-manager';
import sortItems from './sort-items';

const headerWithControlsHeight = theme.toolbarHeight + getStatusBarHeight() + 30;


class ProjectTasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      root: { projectId: null, companyId: null },
      path: [],
      splash: true,
      lmbIcon: 'menu',
      filterTaskStatusId: null,
      sortOption: { id: null, sort: 'asc' },
    };
    this.renderAddButton = this.renderAddButton.bind(this);
    this.renderResult = this.renderResult.bind(this);
    this.handleProjectsRootPress = this.handleProjectsRootPress.bind(this);
    this.handleProjectPress = this.handleProjectPress.bind(this);
    this.handleTaskPress = this.handleTaskPress.bind(this);
    //this.handleBackButton = this.handleBackButton.bind(this);
    this.handleTopLevelButton = this.handleTopLevelButton.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleFilterTaskStatusSelect = this.handleFilterTaskStatusSelect.bind(this);
    this.handleSortOptionSelect = this.handleSortOptionSelect.bind(this);
  }
  render() {
    return (
      <StyleProvider style={getTheme(theme)}>
        <Container>
          {this.renderHeader()}
          {this.renderResult()}
        </Container>
      </StyleProvider>
    );
  }
  renderHeader() {
    const { root, path, lmbIcon } = this.state;
    const { projectTasks: { project } } = this.props;

    let title = 'Projects';
    let lmbFunc = () => this.props.navigation.openDrawer();

    let projectId = path.length > 0 ? path[path.length-1] : root.projectId;
    if (root.projectId && path.length > 0) {

      if (project && project.id) {
        lmbFunc = () => this.handleTopLevelButton(true);
      }
    }

    // screen opened from favorites
    const { params } = this.props.navigation.state;
    if (params && params.projectId) {
      lmbFunc = () => this.props.navigation.goBack();
    }

    /*const project2 = gd.session.projects.get(projectId);
    if (project2) {
      title = project2.name;
    }*/


    let headerBg = theme.toolbarDefaultBg;
    let projectId3 = path.length > 0 ? path[path.length-1] : null;
    if (projectId3) {
      const project3 = gd.session.projects.get(projectId3);
      if (project3) {
        title = project3.name;
        headerBg = '#' + gd.const.project.color[project3.color];
      }
    }

    const showTree = path.length == 0;

    if (showTree) {
      return (
        <ColorHeader style={{backgroundColor: headerBg}}>
          <Left>
            <Button transparent onPress={lmbFunc}>
              <Icon name={lmbIcon} />
            </Button>
          </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right>
            {this.renderAddButton()}
          </Right>
        </ColorHeader>
      )
    }

    return (
      <ColorHeader style={{backgroundColor: headerBg, height: headerWithControlsHeight}}>
        <Grid>
          <Row>
            <Left>
              <Button transparent onPress={lmbFunc}>
                <Icon name={lmbIcon} />
              </Button>
            </Left>
            <Body>
            <Title>{title}</Title>
            </Body>
            <Right>
              {this.renderAddButton()}
            </Right>
          </Row>
          {this.renderControls()}
        </Grid>
      </ColorHeader>
    )
  }
  renderAddButton() {
    const { root, path, splash } = this.state;
    if (splash) return null;

    if (path.length < 1) return null; //root screen with tree

    const { projectTasks: { project } } = this.props;
    const { navigation } = this.props;

    let projectId = null;
    if (root.projectId) {
      if (project && project.id) projectId = project.id;
      else projectId = root.projectId
    }

    let showAddButton = true;
    const projectToAddTo = gd.session.projects.get(projectId);
    if (projectToAddTo) {
      if (projectToAddTo.isDeleted || gd.const.systemStatus.isClosed(projectToAddTo.systemStatus) || projectToAddTo.systemType === gd.const.project.type.TAG) {
        showAddButton = false;
      }
    } else {
      showAddButton = false;
    }

    if (showAddButton && projectId) {
      return (
        <Button transparent onPress={() => navigation.navigate('task_create', {projectId})}>
          <Icon name="add" />
        </Button>
      );
    }
    return null;
  }
  renderControls() {
    const { path, filterTaskStatusId, sortOption } = this.state;
    const showTree = path.length == 0;
    if (showTree) return null;

    const { projectTasks: { project, tasks }, navigation } = this.props;

    let existingTaskStatuses = [];
    let allTaskTypeIds = [];
    let allPossibleStatuses = [];
    let projectTasksStatuses = [];

    const taskStatuses = [{ id: null, name: 'All tasks'}];

    if (project && tasks && tasks.length > 0) {

      /*
      // system task statuses
      const availableSysStatuses = _.uniq(_.map(tasks.filter(t => t.projectId == project.id),'systemStatus'));
      [1,2,3,4,5,6].forEach(sysId => {
        if (availableSysStatuses.indexOf(sysId) > -1 || sysId == filterTaskStatusId ) {
          taskStatuses.push({
            id: sysId,
            name: gd.const.systemStatusList[sysId]
          });
        }
      });
      //console.log('availableSysStatuses', availableSysStatuses);
      //console.log('taskStatuses', taskStatuses);
      */

      // project task statuses

      projectTasksStatuses = TaskStatusManager.getTaskStatuses({projectId: project.id}, {idOnly:true});

      const curLevelTasks = tasks.filter(t => t.projectId == project.id);

      curLevelTasks.forEach(t => {
        allTaskTypeIds.push(t.taskTypeId);
        existingTaskStatuses.push(t.statusId);
      });

      /*let uniqueTaskTypeIds = _.uniq(allTaskTypeIds);

      uniqueTaskTypeIds.forEach(taskTypeId => {
        let taskType = gd.session.taskTypes.get(taskTypeId);
        taskType.statuses.forEach(taskStatus => {
          allPossibleStatuses.push(taskStatus.statusId);
        })
      });*/

      allPossibleStatuses = existingTaskStatuses; //allPossibleStatuses.concat(existingTaskStatuses);
      let uniquePossibleStatuses = _.uniq(allPossibleStatuses);

      const statuses = [];
      uniquePossibleStatuses.forEach(statusId => {
        statuses.push(gd.session.statuses.get(statusId));
      });

      const sorted = _.orderBy(statuses,
        ['systemStatus', s => {
            const index = projectTasksStatuses.indexOf(s.id);
            return index === -1 ? projectTasksStatuses.length + 1 : index;
          },
          'color', 'name'
        ],
        ['asc', 'asc', 'asc']);

      sorted.forEach(st => {
        taskStatuses.push({
          id: st.id,
          name: st.name,
        });
      })
    }

    return (
      <ProjectControls
        navigation={navigation}
        taskStatuses={taskStatuses}
        statusId={filterTaskStatusId}
        onTaskStatusSelect={this.handleFilterTaskStatusSelect}
        sortOption={sortOption}
        onSortOptionSelect={this.handleSortOptionSelect}
      />
    )

  }
  renderResult() {
    const { root, path, splash, filterTaskStatusId, sortOption } = this.state;
    const { projectTasks: { isFetching, error, project, subprojects, tasks } } = this.props;

    if (error) {
      return (
        <Content contentContainerStyle={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <Text>Oops... Something went wrong.</Text>
        </Content>
      )
    }

    if (splash || isFetching) return <LoadingContent />;

    const showTree = path.length == 0;

    if (showTree) {
      return (
        <Content content-projects-tree>
          <ProjectsRoot onPress={this.handleProjectsRootPress} projectId={root.projectId} dontMarkSelectedProject />
        </Content>
      );
    }

    //console.log('subprojects', subprojects);
    //console.log('tasks', tasks);

    // current level projects
    const list = [];
    const filteredSubprojects = [];
    const filteredTasks = [];

    if (subprojects && subprojects.length > 0 && !filterTaskStatusId) {
      subprojects.forEach(s => {
        if (s.parentId == project.id) {
          /*//s.type = 'project';
          //s.id2 = 'p-' + s.id;

          let showSubproj = true;
          //filter by status
          if (filterTaskStatusId && tasks && tasks.length > 0)  {
            showSubproj = false;
            tasks.some(t => {
              if (t.systemStatus == filterTaskStatusId && t.projectId == s.id) {
                showSubproj = true;
                return true;
              }
            })
          }

          if (!showSubproj) return;*/

          list.push(s);
          filteredSubprojects.push(s);
        }
      })
    }
    // current level tasks
    if (tasks && tasks.length > 0) {
      tasks.forEach(t => {
        if (t.projectId == project.id) {
          //t.type = 'task';
          //t.id2 = 't-' + t.id;

          //filter by status
          //if (filterTaskStatusId && filterTaskStatusId != t.systemStatus) return;
          if (filterTaskStatusId && filterTaskStatusId != t.statusId) return;

          list.push(t);
          filteredTasks.push(t);
        }
        if (t.projectId === null && t.tags) {
          if (t.tags.indexOf(project.id) > -1) {
            list.push(t);
            filteredTasks.push(t);
          }
        }
      })
    }

    /*
    // add link to parent
    const top = gd.session.projects.get(path[path.length-1]);
    top.type = 'project';
    top.id2 = 'p-' + top.id;
    top.levelUp = true;
    list.unshift(top);
    */

    //console.log('list', list);

    const rc = <RefreshControl refreshing={isFetching} onRefresh={this.handleRefresh} />;

    if (list.length > 0) {
      //console.log('list', list);
      //list.sort(ptListComparator); // do we need this?

      const tasksList = new TaskListCollection();
      tasksList.addTasksAndProjects(filteredTasks, filteredSubprojects);
      //tasksList.updateChildrenItems('p-' + project.id);
      const sortedItems = sortItems(project.companyId, sortOption, tasksList);

      return (
        <Content refreshControl={rc}>
          <ProjectsTasksList items={sortedItems} onProject={this.handleProjectPress} onTask={this.handleTaskPress} />
        </Content>
      )
    }

    return (
      <Content refreshControl={rc}
               contentContainerStyle={{flex: 1, alignItems:'center', justifyContent:'center'}}>
        <Text>No open tasks found.</Text>
      </Content>
    )

  }
  handleProjectsRootPress(projectId, companyId) {
    console.log('handleProjectsRootPress', projectId, companyId);
    const path = this.state.path;
    path.push(projectId);
    this.setState({root:{projectId, companyId}, path, lmbIcon:'arrow-back'});

    this.props.actions.loadProjectTasks(projectId);
  }
  handleProjectPress(projectId) {
    console.log('handleProjectPress', projectId);
    const path = this.state.path;
    console.log('path', path);

    if (path.indexOf(projectId) === -1) {
      // go deeper
      path.push(projectId);
      this.setState({path});
      this.props.actions.loadProjectTasks(projectId);
      return;
    }

    const last = path.length > 1 ? path[path.length-1] : null;
    const prev = path.length > 1 ? path[path.length-2] : null;
    if (last && last == projectId && prev) {
      // go upper
      const newPath = path.slice(0, -1);
      this.setState({path: newPath});
      this.props.actions.loadProjectTasks(prev);
      return;
    }

    // go to root
    this.setState({path:[]});
  }
  handleRefresh() {
    const { root, path } = this.state;
    const projectId = path.length > 0 ? path[path.length-1] : root.projectId;
    this.props.actions.loadProjectTasks(projectId);
  }
  handleTaskPress(taskId) {
    console.log('handleTaskPress', taskId);
    this.props.actions.loadTask(taskId);
    this.props.navigation.navigate('task_view');
  }
  /*
  handleBackButton() {
    console.log('handleBackButton');
    if (this.state.path.length > 0) {
      const { projectTasks: { project } } = this.props;
      if (project) {
        this.handleProjectPress(project.id);
      } else {
        // something wrong
        this.props.navigation.goBack();
      }
    } else {
      this.props.navigation.goBack();
    }
    return true; // for BackHandler
  }
  */
  handleTopLevelButton(fromLmb) {
    console.log('handleTopLevelButton', fromLmb);
    if (!fromLmb) {
      // need to check if this screen active
      if (window.nativeAppCurrRouteName !== 'root_screen') {
        return false; // for BackHandler
      }
    }
    const { path } = this.state;
    if (path.length > 0) {
      this.setState({ path: [], lmbIcon: 'menu', filterTaskStatusId: null });
      return true; // for BackHandler
    }
    return false; // for BackHandler
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params && params.projectId) {
      this.setState({
        root:{projectId: params.projectId, companyId: null},
        path: [params.projectId],
        lmbIcon:'arrow-back'
      });
      this.props.actions.loadProjectTasks(params.projectId);
    }

    theme.platform == 'android' && BackHandler.addEventListener('hardwareBackPress', this.handleTopLevelButton);

    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({splash:false})
      });
    }, 100);
  }
  componentWillUnmount() {
    theme.platform == 'android' && BackHandler.removeEventListener('hardwareBackPress', this.handleTopLevelButton);
  }
  handleFilterTaskStatusSelect(statusId) {
    console.log('handleFilterTaskStatusSelect', statusId);
    this.setState({filterTaskStatusId: statusId});
  }
  handleSortOptionSelect(sortOption) {
    console.log('handleSortOptionSelect', sortOption);
    this.setState({sortOption});
  }
}


function mapStateToProps(state) {
  return {
    projectTasks: state.projectTasks
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadProjectTasks: projectId => dispatch(loadProjectTasks(projectId)),
      loadTask: taskId => dispatch(loadTask(taskId)),
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectTasksScreen);
