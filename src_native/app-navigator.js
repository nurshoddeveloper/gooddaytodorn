import React from 'react';
import { Easing, Animated } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import theme from './app-theme/variables/platform';
import Drawer from './screens/drawer/drawer';
import MyWorkFolderScreen from './screens/my-work-folder/my-work-folder-screen';
import TaskCreateScreen from './screens/task-create/task-create-screen';
import SelectProjectScreen from './screens/common/select-project-screen';
import SelectUserScreen from './screens/common/select-user/select-user-screen';
import SelectTypeScreen from './screens/common/select-type-screen';
import TaskViewScreen from './screens/task-view/task-view-screen';
import TaskReplyScreen from './screens/task-reply/task-reply-screen';
import SelectStatusScreen from './screens/common/select-status-screen';
import SelectPriorityScreen from './screens/common/select-priority-screen';
import SelectDateScreen from './screens/common/select-date-screen';
import ViewImageScreen from './screens/common/view-image-screen';
import ProjectTasksScreen from './screens/project-tasks/project-tasks-screen';
import EventViewScreen from './screens/event-view/event-view-screen';
import EventSelectDateScreen from './screens/common/event/event-select-date-screen';
import EventSelectStatusScreen from './screens/common/event/event-select-status-screen';
import EventSelectUserScreen from './screens/common/event/event-select-user-screen';
import SelectOneItemScreen from './screens/common/select-one-item-screen';
import SelectEstimateScreen from './screens/common/select-estimate/select-estimate-screen';
import SelectProgressScreen from './screens/common/select-progress/select-progress-screen';
import AddTimeReport from './screens/task-view/add-time-report'
import ratings from './screens/task-view/custom-fields-controls/ratings';
import TextBox from './screens/task-view/custom-fields-controls/TextBox';
import AmountField from './screens/task-view/custom-fields-controls/amount-field';
import EmailField from './screens/task-view/custom-fields-controls/email';
import LinkField from './screens/task-view/custom-fields-controls/linkField';
import NumberField from './screens/task-view/custom-fields-controls/number-field';
import percentageField from './screens/task-view/custom-fields-controls/percentage-field';
import phoneField from './screens/task-view/custom-fields-controls/phone-field';
import DropDownSelection from './screens/task-view/custom-fields-controls/dropdown';
import MultiValues from './screens/task-view/custom-fields-controls/multiValues';
import ProjectFolderScreen from './screens/project-folder/project-folder-screen';
import TaskRenameScreen from './screens/task-rename/task-rename-screen'
import EditMessageScreen from './screens/edit-message/edit-message-screen'

const navigationOptions = {
  //headerStyle
};

//let tsd = new Date();

const stackNavigatorParams = {
  initialRouteName: 'drawer', //'select_estimate', // 'drawer',
  headerMode: 'none',
  cardStyle: {
    backgroundColor: 'white',
  }
  /*onTransitionStart: () => {
    tsd = new Date();
    console.log('onTransitionStart')
  },
  onTransitionEnd: () => {
    console.log('onTransitionEnd', new Date() - tsd)
  }*/
};

if (theme.platform == 'android') {
  stackNavigatorParams.transitionConfig = () => ({
    transitionSpec: {
      duration: 0,
      easing: Easing.step0,
      timing: Animated.timing,
    },
    screenInterpolator: () => null
  })
}

// https://reactnavigation.org/docs/navigators/stack

const AppNavigator = createStackNavigator({
  drawer: {
    screen: Drawer,
    path: 'drawer',
    navigationOptions,

  },
  /*login: {
    screen: LoginScreen,
    navigationOptions
  },*/
  /*my_work: {
    screen: MyWorkScreen,
    navigationOptions
  },*/
  my_work_folder: {
    screen: MyWorkFolderScreen,
    navigationOptions,
    path : 'my-work-folder'
  },
  task_create: {
    screen: TaskCreateScreen,
    navigationOptions,
    path:'task-create'
  },
  task_view: {
    screen: TaskViewScreen,
    path : 'task-view'
  },
  project_folder: {
    screen: ProjectFolderScreen,
    path : 'project-folder'
  },
  add_time_report: {
    screen: AddTimeReport,
    path : 'add-time-report'
  },
  task_reply: {
    screen: TaskReplyScreen,
    path : 'task-reply'
  },
  task_rename: {
    screen: TaskRenameScreen,
    path: 'task-rename'
  },
  edit_message: {
    screen: EditMessageScreen,
    path: 'edit-message'
  },
  project_tasks: {
    screen: ProjectTasksScreen,
    navigationOptions,
    path : 'project-task'
  },
  select_project: {
    screen: SelectProjectScreen,
    navigationOptions,
    path: 'project'
  },
  select_user: {
    screen: SelectUserScreen,
    navigationOptions
  },
  select_type: {
    screen: SelectTypeScreen,
    navigationOptions,
    path : 'status'
  },
  select_status: {
    screen: SelectStatusScreen,
    path : 'select-status',
    navigationOptions
  },
  select_priority: {
    screen: SelectPriorityScreen,
    path : 'select-priority',
    navigationOptions
  },
  select_date: {
    screen: SelectDateScreen,
    path : 'select-date',
    navigationOptions
  },
  view_image: {
    screen: ViewImageScreen,
    path : 'view-image',
    navigationOptions
  },
  event_view: {
    screen: EventViewScreen,
    navigationOptions
  },
  event_select_date: {
    screen: EventSelectDateScreen,
    navigationOptions
  },
  event_select_status: {
    screen: EventSelectStatusScreen,
    navigationOptions
  },
  event_select_user: {
    screen: EventSelectUserScreen,
    navigationOptions
  },
  select_one_item: {
    screen: SelectOneItemScreen,
    navigationOptions
  },
  select_estimate: {
    screen: SelectEstimateScreen,
    navigationOptions
  },
  select_progress: {
    screen: SelectProgressScreen,
    navigationOptions
  },
  // Custom Fields
  rating: {
    screen: ratings,
    navigationOptions
  },
  textbox: {
    screen: TextBox
  },
  dropdown: {
    screen: DropDownSelection
  },
  amountfield: {
    screen: AmountField
  },
  emailField: {
    screen: EmailField
  },
  linkfield: {
    screen: LinkField
  },
  numberfield: {
    screen: NumberField
  },
  percentagefield: {
    screen: percentageField
  },
  phonefield: {
    screen: phoneField
  },
  multifields: {
    screen: MultiValues
  }
},
  stackNavigatorParams
);


// fix for double screen change
// https://github.com/react-navigation/react-navigation/issues/271#issuecomment-344403238
/*

import deepDiffer from 'react-native/lib/deepDiffer';
import { NavigationActions, StateUtils } from 'react-navigation';

export const getActiveRouteForState = navigationState =>
  navigationState.routes
    ? getActiveRouteForState(navigationState.routes[navigationState.index])
    : navigationState;

export const isEqualRoute = (route1, route2) => {
  if (route1.routeName !== route2.routeName) {
    return false;
  }
  return !deepDiffer(route1.params, route2.params);
};

const PATTERN_DRAWER_ROUTE_KEY = /^Drawer(Open|Close|Toggle)$/;
export const isDrawerRoute = route => PATTERN_DRAWER_ROUTE_KEY.test(route.routeName);

export const withNavigationPreventDuplicate = getStateForAction => {
  const defaultGetStateForAction = getStateForAction;

  const getStateForActionWithoutDuplicates = (action, state) => {
    if (action.type === NavigationActions.NAVIGATE) {
      const previousRoute = getActiveRouteForState(StateUtils.back(state));
      const currentRoute = getActiveRouteForState(state);
      const nextRoute = action;

      if (isDrawerRoute(currentRoute) && isEqualRoute(previousRoute, nextRoute)) {
        return StateUtils.back(state); // Close drawer
      }

      if (isEqualRoute(currentRoute, nextRoute)) {
        return null;
      }
    }

    return defaultGetStateForAction(action, state);
  };

  return getStateForActionWithoutDuplicates;
};

AppNavigator.router.getStateForAction = withNavigationPreventDuplicate(
  AppNavigator.router.getStateForAction
);
*/
const prefix = 'gooddaywork://';

// export default AppNavigator;
export default MainApp = () => <AppNavigator uriPrefix={prefix} />;
