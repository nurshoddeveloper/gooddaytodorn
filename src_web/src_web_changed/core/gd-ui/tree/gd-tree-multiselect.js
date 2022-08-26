const React = require('react');
//const { PropTypes } = require('react');

const TreeCompanyView = require('./components/tree-company-view.js');
const TreeProjectView = require('./components/tree-project-view.js');
//const VScroll = require('../../gd-components/custom-v-scroll/v-scroll.jsx');

//const Classes = require('classnames');
const _ = require('lodash');

class GDTreeMultiselect extends React.PureComponent {

    /*propTypes: {
        companies: PropTypes.array,
        expanded: PropTypes.shape({
            companies: PropTypes.array,
            projects: PropTypes.array
        }),
        values: PropTypes.shape({
            companies: PropTypes.array,
            projects: PropTypes.array
        }),
        filterProjects: PropTypes.arrayOf(PropTypes.shape({
            counter: PropTypes.number,
            item: PropTypes.object
        })),

        companiesSelectable: PropTypes.bool,
        singleCompanyVisible: PropTypes.bool,
        showOnlyFilterProjects: PropTypes.bool,
        showProjectIcon: PropTypes.bool,
        scrollContentStyle: PropTypes.object,
        onChange: PropTypes.func.isRequired
    },*/

    getDefaultProps() {
        return {
            expanded: {},
            companiesSelectable: true,
            singleCompanyVisible: true
        }
    }

    getInitialState() {
        const { values } = this.props;

        const initialValues = {
            projects: values && values.projects ? values.projects : [],
            companies: values && values.companies ? values.companies : []
        };

        return {
            expanded: [],
            values: initialValues,
            projectsToShow: this.getProjectsToShow(this.props)
        }
    }

    componentDidMount() {
        this.initialItemsExpand(this.props)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { values } = nextProps;
        const initialValues = {
            projects: values && values.projects ? values.projects : [],
            companies: values && values.companies ? values.companies : []
        };

        this.setState({
            values: initialValues,
            projectsToShow: this.getProjectsToShow(nextProps)
        });
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
        const { expanded, values } = props;
        const { companies, projects } = expanded;

        let toExpand = [];
        toExpand = toExpand.concat(companies ? companies.map(id=>"c_"+id) : []);
        toExpand = toExpand.concat(projects ? projects.map(id=>"p_"+id) : []);

        if (values){
            const { projects } = values;

            projects.map(pId=>{
                const project = gd.tree.getProject(pId);
                toExpand = toExpand.concat(gd.tree.findProjectParents(project).map(p=>"p_"+p.id));
                toExpand.unshift("c_"+project.companyId);
            });

            toExpand = _.uniq(toExpand);
        }

        this.setState({expanded: toExpand});
    }

    onToggleExpand(id) {
        const oldIsExpanded = this.state.expanded.includes(id);
        const newIsExpanded = !oldIsExpanded;

        const newExpanded = this.state.expanded.slice(0);

        if (newIsExpanded)  newExpanded.push(id);
        else                newExpanded.remove(id);

        this.setState({expanded: newExpanded});
    }

    onProjectClick(project) {
        const { values } = this.state;

        let newValue;

        if (values){
            const { projects, companies } = values;

            let newProjects = projects.slice();

            if (project.id){
                const index = newProjects.indexOf(project.id);
                if (index === -1) newProjects.push(project.id);
                else newProjects.splice(index,1);
            }

            const selectedProjectParents = gd.tree.findProjectParents(gd.tree.getProject(project.id)).map(p=>p.id);
            const selectedProjectChildren = gd.tree.findProjectChildren(project.id).map(c=>c.id);

            const selectedProjectParentsSelected = _.intersection(newProjects, selectedProjectParents);
            if (selectedProjectParentsSelected.length > 0 || companies.indexOf(project.companyId) !== -1)
                newProjects = projects.slice();

            const selectedProjectChildrenSelected = _.intersection(newProjects, selectedProjectChildren);
            _.remove(newProjects, id=>selectedProjectChildrenSelected.indexOf(id) !== -1);

            newValue = {
                projects: newProjects,
                companies: companies
            };

            this.setState({values: newValue}, ()=>{this.props.onChange(newValue)});
        }
    }

    onCompanyClick(companyId) {
        const { values } = this.state;

        if (this.props.companiesSelectable) {
            const { projects, companies } = values;

            const newCompanies = companies.slice();
            let newProjects = projects.slice();

            const index = newCompanies.indexOf(companyId);
            if (index === -1) newCompanies.push(companyId);
            else newCompanies.splice(index,1);

            const selectedCompanyChildren = gd.tree.findCompanyChildren(companyId).map(c=>c.id);

            const selectedCompanyChildrenSelected = _.intersection(newProjects, selectedCompanyChildren);
            _.remove(newProjects, id=>selectedCompanyChildrenSelected.indexOf(id) !== -1);

            const newValue = {
                projects: newProjects,
                companies: newCompanies
            };

            this.setState({values: newValue}, ()=>{this.props.onChange(newValue)});

        } else {
            this.onToggleExpand("c_"+companyId);
        }
    }

    renderCompanyTree(model) {
        const { companies, filterProjects, singleCompanyVisible,
            companiesSelectable, showProjectIcon } = this.props;
        const { expanded, values, projectsToShow } = this.state;

        let selectedCompanies = values.companies;
        let selectedProjects = values.projects;

        const renderTree = (level, parent, inheritedSelection)=>{
            let items = [];

            if (parent.projects) items = parent.projects;
            else items = parent.children ? parent.children : [];

            items.map((i)=>{
                const p = i.project;

                if (projectsToShow && !projectsToShow.includes(p.id)) return;

                const filterItem = filterProjects ? filterProjects.find(fp=>fp.item.id === p.id) : null;
                const expandable = !!i.children.length > 0 &&
                    (!projectsToShow || _.intersection(i.children.map(c=>c.project.id), projectsToShow).length > 0);

                const isExpanded = expanded.includes("p_"+p.id);
                const isSelected = selectedProjects.indexOf(p.id) !== -1;

                res.push(<TreeProjectView key={p.id}
                                          project={p}
                                          counter={filterItem ? filterItem.counter : null}
                                          selectable={!filterItem || !filterItem.notSelectable}
                                          expandable={expandable}
                                          isSelected={isSelected}
                                          isExpanded={isExpanded}
                                          isSelectInherited={inheritedSelection}
                                          level={level}
                                          multiselect={true}
                                          showProjectIcon={showProjectIcon}
                                          onClick={this.onProjectClick}
                                          onToggleExpand={this.onToggleExpand}/>);

                if (expandable && isExpanded) renderTree(level+1,i, isSelected || inheritedSelection);
            });
        };

        const company = model.company;
        const isExpanded = expanded.includes("c_"+company.id);
        const isSelected = company.id && selectedCompanies.indexOf(company.id) !== -1;

        const res = [];

        const showCompany = companies.length !== 1 || singleCompanyVisible;
        if (showCompany) {
            const treeCompanyViewClasses = Classes({
                "not-selectable": !companiesSelectable
            });

            res.push(
                <TreeCompanyView key={"company_"+company.id}
                                 className={treeCompanyViewClasses}
                                 company={company}
                                 isSelected={isSelected}
                                 isExpanded={isExpanded}
                                 multiselect={true}
                                 onClick={this.onCompanyClick}
                                 onToggleExpand={this.onToggleExpand}/>
            );

            if (model.projects && isExpanded) renderTree(1, model, isSelected);
        } else {
            if (model.projects)               renderTree(0, model, isSelected);
        }

        return res;
    }

    renderWeb() {
        const { companies, scrollContentStyle, className } = this.props;
        const classes = Classes(className, 'gd-tree', "is-multiselect");

        return (
            <VScroll className={classes} style={scrollContentStyle}>
                {companies.map(m=>this.renderCompanyTree(m))}
            </VScroll>
        );
    }

    render() {
        return null;
    }
}

module.exports = GDTreeMultiselect;