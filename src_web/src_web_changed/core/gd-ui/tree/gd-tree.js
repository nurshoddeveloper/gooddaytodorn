const React = require('react');
//const { PropTypes } = require('react');

const GDTReeSingle = require('./gd-tree-single.js');
const GDTReeMultiselect = require('./gd-tree-multiselect.js');
const CreateTreeOptions = require('../../../../src/core/gd/structure-control/create-tree-options');

const _ = require('lodash');

//const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;

class GDTree extends React.PureComponent {

  /*propTypes: {
    companies: PropTypes.array,
    parentsFor: PropTypes.oneOf(["common-use", "event", PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG, "task", "user", "report", "tagFilter"]),
    expanded: PropTypes.shape({
      companies: PropTypes.array,
      projects: PropTypes.array
    }),

    //for single only
    value: PropTypes.shape({
      companyId: PropTypes.string,
      projectId: PropTypes.string
    }),

    //for multiselect only
    values: PropTypes.shape({
      companies: PropTypes.array,
      projects: PropTypes.array
    }),

    filterProjects: PropTypes.arrayOf(PropTypes.shape({
      counter: PropTypes.number,
      item: PropTypes.object
    })),

    unselectLabel: PropTypes.string, //for single tree only

    companiesSelectable: PropTypes.bool,
    singleCompanyVisible: PropTypes.bool,
    showOnlyFilterProjects: PropTypes.bool,
    showProjectIcon: PropTypes.bool,
    scrollContentStyle: PropTypes.object,
    multiselect: PropTypes.bool,
    accessLevels: PropTypes.array,
    onToggleExpand: PropTypes.func,
    onChange: PropTypes.func.isRequired
  },*/

  /*getDefaultProps() {
    return {
      multiselect: false
    }
  }*/

  static defaultProps = {
    multiselect: false
  };

  constructor(props) {
    super(props);
  }

  _getParentItems() {
    const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;
    const { companies, parentsFor, accessLevels } = this.props;
    const createTreeOptions = new CreateTreeOptions(companies);

    let filteredTree;
    switch (parentsFor){
      case "task": filteredTree = createTreeOptions.newTask(); break;

      case "event":
      case PROJECT:
      case BACKLOG:
      case SPRINT:
      case TAG:
      case WORKFOLDER:
      case "user":
      case "report":
      case "tagFilter":
      default: filteredTree = createTreeOptions.newProject(parentsFor, accessLevels); break;
    }

    return filteredTree;
  }

  render() {
    const { companies, expanded, value, values, filterProjects, unselectLabel, multiselect, companiesSelectable,
      singleCompanyVisible, showOnlyFilterProjects, showProjectIcon,
      scrollContentStyle, onToggleExpand, onChange, children, className, dontMarkSelectedProject } = this.props;

    const Component = multiselect ? GDTReeMultiselect : GDTReeSingle;

    //always expand single company
    const expandedUpdated = expanded ? expanded : {companies:[],projects:[]};
    if (companies && companies.length === 1) {
      expandedUpdated.companies = _.uniq(expandedUpdated.companies.concat(companies));
    }

    return (
      <Component className={className}
                 companies={this._getParentItems()}
                 expanded={expandedUpdated}
                 value={value}
                 values={values}
                 filterProjects={filterProjects}
                 unselectLabel={unselectLabel}
                 singleCompanyVisible={singleCompanyVisible}
                 companiesSelectable={companiesSelectable}
                 showOnlyFilterProjects={showOnlyFilterProjects}
                 showProjectIcon={showProjectIcon}
                 scrollContentStyle={scrollContentStyle}
                 onToggleExpand={onToggleExpand}
                 onChange={onChange}
                 dontMarkSelectedProject={dontMarkSelectedProject}
      >
        {children}
      </Component>
    );
  }
}

module.exports = GDTree;