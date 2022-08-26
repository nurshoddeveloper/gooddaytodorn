const React = require('react');
//const { PropTypes } = require('react');
const TreeCompanyView = require('./components/tree-company-view.js');
const TreeProjectView = require('./components/tree-project-view.js');
//const VScroll = require('../../gd-components/custom-v-scroll/v-scroll.jsx');
//const Classes = require('classnames');
const _ = require('lodash');
import { View } from 'native-base';

class GDTreeSingle extends React.Component {

    /*propTypes: {
        companies: PropTypes.array,
        expanded: PropTypes.shape({
            companies: PropTypes.array,
            projects: PropTypes.array
        }),
        value: PropTypes.shape({
            companyId: PropTypes.string,
            projectId: PropTypes.string
        }),
        filterProjects: PropTypes.arrayOf(PropTypes.shape({
            counter: PropTypes.number,
            item: PropTypes.object
        })),

        unselectLabel: PropTypes.string,

        companiesSelectable: PropTypes.bool,
        singleCompanyVisible: PropTypes.bool,
        showOnlyFilterProjects: PropTypes.bool,
        showProjectIcon: PropTypes.bool,
        scrollContentStyle: PropTypes.object,
        onToggleExpand: PropTypes.func,
        onChange: PropTypes.func.isRequired
    }*/

    /*getDefaultProps() {
        return {
            expanded: {},
            companiesSelectable: true,
            singleCompanyVisible: true
        }
    }*/

    static defaultProps = {
      expanded: {},
      companiesSelectable: true,
      singleCompanyVisible: true
    };

    /*getInitialState() {
        return {
            expanded: [],
            value: this.props.value,
            projectsToShow: this.getProjectsToShow(this.props)
        }
    }*/

    constructor(props) {
        super(props);
        this.state = {
          expanded: [],
          value: props.value,
          projectsToShow: this.getProjectsToShow(props)
        };
        this.onToggleExpand = this.onToggleExpand.bind(this);
        this.onClickUnselect = this.onClickUnselect.bind(this);
        this.onProjectClick = this.onProjectClick.bind(this);
        this.onCompanyClick = this.onCompanyClick.bind(this);
    }

    componentDidMount() {
        this.initialItemsExpand(this.props)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            projectsToShow: this.getProjectsToShow(nextProps)
        })
    }

    getProjectsToShow(props) {
        const { filterProjects, showOnlyFilterProjects } = props;

        let projectsToShow = null;
        if (showOnlyFilterProjects) {
            projectsToShow = [];
            filterProjects && filterProjects.map(fp=>{
                const project = gd.tree.getProject(fp.item.id);
                const parentsIds = gd.tree.findProjectParents(project).map(p=>p.id);
                projectsToShow = projectsToShow.concat([fp.item.id]).concat(parentsIds);
            });

            projectsToShow = _.uniq(projectsToShow);
        }

        return projectsToShow;
    }

    initialItemsExpand(props) {
        const { expanded, value } = props;
        const { companies, projects } = expanded;

        let toExpand = [];
        toExpand = toExpand.concat(companies ? companies.map(id=>"c_"+id) : []);
        toExpand = toExpand.concat(projects ? projects.map(id=>"p_"+id) : []);

        if (value) {
            const { projectId } = value;

            if (projectId) {
                const project = gd.tree.getProject(projectId);
                toExpand = toExpand.concat(gd.tree.findProjectParents(project).map(p=>"p_"+p.id));
                toExpand.unshift("c_"+project.companyId);
            }
        }

        this.setState({expanded: toExpand});
    }

    onToggleExpand(id) {
        const { onToggleExpand } = this.props;
        const oldIsExpanded = this.state.expanded.includes(id);
        const newIsExpanded = !oldIsExpanded;

        const newExpanded = this.state.expanded.slice(0);

        if (newIsExpanded)  newExpanded.push(id);
        else                newExpanded.remove(id);

        this.setState({expanded: newExpanded});
        if (onToggleExpand) onToggleExpand(id, newIsExpanded);
    }

    onClickUnselect() {
        this.setState({value: null}, ()=>{this.props.onChange(null)});
    }

    onProjectClick(project) {

        const value = {
            projectId: project.id,
            companyId: project.companyId
        };

        this.setState({value: value}, ()=>{this.props.onChange(value)});
    }

    onCompanyClick(companyId) {
        if (this.props.companiesSelectable) {
            const value = {
                projectId: null,
                companyId: companyId
            };

            this.setState({value: value}, ()=>{this.props.onChange(value)});
        } else {
            this.onToggleExpand("c_"+companyId);
        }
    }

    renderCompanyTree(model) {
        const { companies, filterProjects, singleCompanyVisible, companiesSelectable,
            showOnlyFilterProjects, showProjectIcon, dontMarkSelectedProject } = this.props;
        const { expanded, value, projectsToShow } = this.state;

        let selectedCompanies = [];
        let selectedProjects = [];

        if (value) {
            if (value.projectId)        selectedProjects.push(value.projectId);
            else if (value.companyId)   selectedCompanies.push(value.companyId);
        }

        const renderTree = (level, parent)=>{
            let items = [];

            if (parent.projects) items = parent.projects;
            else items = parent.children ? parent.children : [];

            items.map((i)=>{
                const p = i.project;
                if (projectsToShow && !projectsToShow.includes(p.id)) return;

                const filterItem = filterProjects ? filterProjects.find(fp=>fp.item.id === p.id) : null;
                const expandable = i.children.length > 0 &&
                    (!projectsToShow || _.intersection(i.children.map(c=>c.project.id), projectsToShow).length > 0);

                const isExpanded = expanded.includes("p_"+p.id);
                const isSelected = !dontMarkSelectedProject && selectedProjects.indexOf(p.id) !== -1;

                res.push(<TreeProjectView key={p.id}
                                          project={p}
                                          counter={filterItem ? filterItem.counter : null}
                                          selectable={!filterItem || !filterItem.notSelectable}
                                          expandable={expandable}
                                          isSelected={isSelected}
                                          isExpanded={isExpanded}
                                          level={level}
                                          showProjectIcon={showProjectIcon}
                                          disabled={showOnlyFilterProjects && !filterItem}
                                          onClick={this.onProjectClick}
                                          onToggleExpand={this.onToggleExpand}/>);

                if (expandable && isExpanded) renderTree(level+1,i);
            });
        };

        const company = model.company;
        const isExpanded = expanded.includes("c_"+company.id);
        const isSelected = company.id && selectedCompanies.indexOf(company.id) !== -1;

        const res = [];

        const showCompany = companies.length !== 1 || singleCompanyVisible;
        if (showCompany) {
            // const treeCompanyViewClasses = Classes({
            //     "not-selectable": !companiesSelectable
            // });

            let counter = null;
            if (filterProjects) {
                counter = 0;
                model.projects && model.projects.map(p=>{
                    const fItem = filterProjects.find(fp=>fp.item.id === p.project.id);
                    if (fItem && fItem.counter) counter += fItem.counter;
                });
                counter = counter === 0 ? null : counter;
            }

            //const expandable = model.projects.length > 0 &&
            //    (!projectsToShow || _.intersection(model.projects.map(c=>c.project.id), projectsToShow).length > 0);
            const expandable = true;

            res.push(
                <TreeCompanyView key={"company_"+company.id}
                                 //className={treeCompanyViewClasses}
                                 company={company}
                                 counter={counter}
                                 expandable={expandable}
                                 isSelected={isSelected}
                                 isExpanded={isExpanded}
                                 onClick={this.onCompanyClick}
                                 onToggleExpand={this.onToggleExpand}/>
            );

            if (expandable && isExpanded) renderTree(1, model);
        } else {
            if (model.projects)           renderTree(0, model);
        }

        return res;
    }

    renderWeb() {
        const { companies, scrollContentStyle, unselectLabel, children, className } = this.props;
        const { value } = this.state;
        const classes = Classes(className, 'gd-tree');

        const unselectLabelClasses = Classes("gd-tree-item-unselect",{
            'gd-tree-item-selected': !value
        });

        return (
            <VScroll className={classes} style={scrollContentStyle}>
                {unselectLabel &&
                <div className={unselectLabelClasses} onClick={this.onClickUnselect}>
                    <div className="gd-tree-item-name">{unselectLabel}</div>
                </div>}
                {companies.map(m=>this.renderCompanyTree(m))}
                {children}
            </VScroll>
        );
    }

    render() {
      const { companies, children } = this.props;
        return (
          <View style={{paddingVertical: 10}}>
            {companies.map(m=>this.renderCompanyTree(m))}
            {children}
          </View>
        );
    }
}

module.exports = GDTreeSingle;