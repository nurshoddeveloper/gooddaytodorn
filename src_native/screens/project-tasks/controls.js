import React from 'react';
import _ from 'lodash';
import { Platform, PixelRatio } from 'react-native';
import {
  Row, Col,
  Item, Text, View
} from 'native-base';
import theme from '../../app-theme/variables/platform';
import { getGlyphByName } from '../../common/icons';


function getSortOptions() {
  const { TITLE, STATUS, PRIORITY, SCHEDULE, DEADLINE, TASK_TYPE, ASSIGNED_TO, DATE_CREATED, LAST_UPDATED } = gd.const.fields.type;

  return [
    {id: null,              name: 'Default' },
    {id: TITLE,             name: 'Title',             defaultSort: 'asc',  },
    {id: STATUS,            name: 'Status',            defaultSort: 'asc',  },
    {id: PRIORITY,          name: 'Priority',          defaultSort: 'desc', },
    {id: SCHEDULE,          name: 'Schedule',          defaultSort: 'asc',  },
    {id: DEADLINE,          name: 'Deadline',          defaultSort: 'asc',  },
    {id: TASK_TYPE,         name: 'Task type',         defaultSort: 'asc',  },
    {id: ASSIGNED_TO,       name: 'Assigned to',       defaultSort: 'asc',  },
    {id: DATE_CREATED,      name: 'Date created',      defaultSort: 'asc',  },
    {id: LAST_UPDATED,      name: 'Last updated',      defaultSort: 'asc',  },
  ];
}


export default class ProjectControls extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onSortOptionSelect = this.onSortOptionSelect.bind(this);
  }

  onSortOptionSelect(id) {
    const { onSortOptionSelect } = this.props;

    const defVal = { id: null, sort: 'asc' };

    if (!id) {
      onSortOptionSelect(defVal);
      return;
    }

    const all = getSortOptions();
    const opt = _.find(all, a => a.id == id);
    if (opt) {
      onSortOptionSelect({id: opt.id, sort: opt.defaultSort});
      return;
    }

    onSortOptionSelect(defVal);
  }

  render() {
    const { taskStatuses, statusId, onTaskStatusSelect, sortOption, navigation } = this.props;

    const status = _.find(taskStatuses, {id: statusId});
    const systemStatusName = status ? status.name : 'All tasks';

    const allSortOptions = getSortOptions();
    const opt = _.find(allSortOptions, a => a.id == sortOption.id);
    const sortingName = opt ? opt.name : 'Default';

    const glyph = String.fromCharCode(getGlyphByName('arrow-down'));

    return (
      <Row style={styleStatusRow}>
        <Col size={1} style={styleCol1}>
          <Item project-control-item onPress={() => navigation.navigate('select_one_item', {title: 'Select status', items: taskStatuses, selectedId: statusId, onPress:onTaskStatusSelect})}>
            <Text header>Status</Text>
            <View pci-selector>
              <Text numberOfLines={1}>{systemStatusName}</Text>
              <Text gd-icon>{glyph}</Text>
            </View>
          </Item>
        </Col>
        <Col size={1}>
          <Item project-control-item onPress={() => navigation.navigate('select_one_item', {title: 'Select sorting', items: getSortOptions(), selectedId: sortOption.id, onPress:this.onSortOptionSelect})}>
            <Text header>Sorting</Text>
            <View pci-selector>
              <Text numberOfLines={1}>{sortingName}</Text>
              <Text gd-icon>{glyph}</Text>
            </View>
          </Item>
        </Col>
      </Row>
    )
  }
}

const styleStatusRow = {
  padding: 0,
  marginHorizontal: -10,
  borderBottomWidth: 1, //theme.borderWidth,
  borderColor: theme.cardBorderColor,
  backgroundColor: theme.taskViewControlsBg,
};

const styleCol1 = {
  borderRightWidth: theme.borderWidth, // 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  borderRightColor: theme.cardBorderColor,
};
