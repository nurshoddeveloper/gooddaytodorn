import _ from 'lodash';
import CompaniesCollection from '../../../src_web/src/core/gd-model/tree/companies-collection';
import FieldsFactory from '../../../src_web/src/core/fields/fields-factory';

// from src\core\gd-modules\task-list\manager\sorting-manager.js

export default function sortItems(companyId, sortOption, tasksList) {
  const treeSource = new CompaniesCollection([gd.session.companies.get(companyId)]);
  treeSource.resetCompanyProjects(companyId, {
    silent: true,
    includeArchived: true
  });
  const projectsSortMap = treeSource.getCompanyProjectsSortMap(companyId);

  let sortFunctionsArray = [i=>i.type === 'project' ? 0 : 1];
  let sortDirectionsArray = ['asc'];

  if (sortOption) {
    const { id, customFieldId, sort } = sortOption;

    switch (id) {
      case gd.const.fields.type.TITLE:
      case gd.const.fields.type.STATUS:
      case gd.const.fields.type.PRIORITY:
      case gd.const.fields.type.SCHEDULE:
      case gd.const.fields.type.DEADLINE:
      case gd.const.fields.type.TASK_TYPE:
      case gd.const.fields.type.ASSIGNED_TO:
      case gd.const.fields.type.DATE_CREATED:
      case gd.const.fields.type.LAST_UPDATED:
      //
      case gd.const.fields.type.TASK_ID:
      case gd.const.fields.type.TASK_USERS:
      case gd.const.fields.type.TAGS:
      case gd.const.fields.type.ESTIMATE:
      case gd.const.fields.type.PROGRESS_BAR:
      case gd.const.fields.type.TIME_REPORTED:
      case gd.const.fields.type.CREATED_BY:
      case gd.const.fields.type.ACTION_REQUIRED:
      case gd.const.fields.type.START_DATE:
      case gd.const.fields.type.END_DATE:
      //
      case gd.const.fields.type.CUSTOM_FIELD:
        const entityTypeOrCustomFieldId = id === gd.const.fields.type.CUSTOM_FIELD ? customFieldId : null;
        const sortFunc = FieldsFactory.get(id, entityTypeOrCustomFieldId).listItemSortFunctions(sort);
        sortFunctionsArray = sortFunctionsArray.concat(sortFunc.functions);
        sortDirectionsArray = sortDirectionsArray.concat(sortFunc.directions);
        break;
    }
  }

  sortFunctionsArray.push(i=>{
    let res = 0;
    if (i.parentId) {
      //const parent = this.getItem(i.parentId);
      const parent = tasksList.get(i.parentId);
      //const parent = _.find(tasksList, tt => tt.type == 'project' && tt.id == i.parentId);
      if (parent) res = projectsSortMap[parent.item.id]
    }
    return res;
  });
  sortDirectionsArray.push('asc');

  sortFunctionsArray.push(i=> i.item.sortPosition);
  sortDirectionsArray.push('asc');

  return _.orderBy(tasksList.models, sortFunctionsArray, sortDirectionsArray);
}