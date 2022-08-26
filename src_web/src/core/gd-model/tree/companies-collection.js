import _ from 'lodash';
const ProjectsTreeCollection = require('./projects-collection');

const Debug = {
    dev: false,
    head: "ProjectsTreeCollection"
};

class CompaniesCollection {

    constructor(data) {
        this.reset(data);
    }

    reset(data) {
        this._companies = data ? data.slice(0) : [];

        this._projectsById = {};
        this._companiesById = {};

        this.remap();
    }

    get singleCompany() {
        return !(this._companies && this._companies.length>1);
    }

    get companies() {
        return this._companies;
    }



    getCompany(id) {
        return this._companiesById[id];
    }

    getProject(id) {
        return this._projectsById[id];
    }

    remap() {
        this._companies.map(el=>{
            this._companiesById[el.id] = el;
        })
    }

    sortedByName() {

    }

    findProjectParents(project) {

        let allParents = this._checkParentRecursively(project,[]);

        if (!allParents) allParents = [];

        return allParents.reverse();

    }

    findProjectChildren(projectId, options = {}){
        const { sort } = options;
        const p = this.getProject(projectId);
        const res = [];

        const getItemsRecursive = (parent)=>{
            const { children } = parent;
            let items = [];
            if (children) {
                switch(sort){
                    case 'name':    items = children.sortedByName; break;
                    default:        items = children.list(); break;
                }
            }
            items.map(child=>{
                res.push(child);
                getItemsRecursive(child)
            });
        };

        if (p) getItemsRecursive(p);

        return res;
    }

    findCompanyChildren(companyId, options = {}){
        const { sort } = options;
        const c = this.getCompany(companyId);
        const res = [];

        const getItemsRecursive = (parent)=>{
            const { children } = parent;
            if (children) {
                let items = [];
                switch(sort){
                    case 'name':    items = children.sortedByName; break;
                    default:        items = children.list(); break;
                }
                items.map(child=>{
                    res.push(child);
                    getItemsRecursive(child)
                });
            }
        };

        let projects = [];
        switch(sort){
            case 'name':    projects = c.projects.sortedByName; break;
            default:        projects = c.projects.list(); break;
        }

        projects.map(p=>{
            res.push(p);
            getItemsRecursive(p);
        });

        return res;
    }

    _checkParentRecursively(project,allParents) {
        if (project && project.parent) {
            allParents.push(project.parent);
            this._checkParentRecursively(project.parent,allParents);
        }

        return allParents;
    }

    resetCompanyProjects(companyId, options = {}) {
        const { silent, includeArchived, includeTemplates  } = options;

        if (Debug.dev) console.log(Debug.head,".resetCompanyProjects");

        const company = this.getCompany(companyId);
        if (!company) {
            console.log("CompaniesCollection resetCompanyProjects: no organization found, skip", companyId);
            return;
        }

        const companyProjects = (company.projects)?company.projects.sortedByName:[];

        // remove
        if (companyProjects) {
            companyProjects.map(project => {
                delete this._projectsById[project.id];
            });
        }

        const projectsMap = {};
        const projectsTree = [];
        const projects = gd.session.projects.findCompanyProjectsForTree(companyId, {
            includeArchived: includeArchived,
            includeTemplates: includeTemplates
        });

        if (projects) {
            projects.map(project=>{
                projectsMap[project.id] = project;
            });

            // REMOVE parents if no access to parent
            projects.map(project=>{
                if (project.parentId && !projectsMap[project.parentId]) {
                    project.parentId = null;
                }
            });

            if (Debug.dev) console.log("Projects map", projectsMap);

            projects.map(project=>{
                if (project.parentId) {
                    const parentProject = projectsMap[project.parentId];

                    if (!parentProject) {
                        console.error("TREE ERROR, project parent not found",project);
                        project.parentId = null;
                        return;
                    }

                    if (!projectsMap[parentProject.id].children) projectsMap[parentProject.id].children=[];
                    projectsMap[parentProject.id].children.push(project);
                } else {
                    projectsTree.push(project);
                }
            });
        }

        company.projects = new ProjectsTreeCollection(this,projectsTree,null);

        if(!silent) gd.bus.triggerEventDebounced("tree-change");
    }

    getCompanyProjectsSortMap(companyId) {
        const sortMap = {};
        const company = this.getCompany(companyId);
        let sortIndex = 0;

        const collectTree = (level, parent)=>{
            let items = [];

            if (parent.projects) items = parent.projects.list();
            else items = parent.children ? parent.children.list() : [];

            _.orderBy(items, project=>project.sortPosition, 'asc').map((m)=>{
                sortMap[m.id] = sortIndex++;
                collectTree(level+1, m);
            });
        };

        collectTree(0, company);

        return sortMap;
    }

    // companies() {
    //     return this._companies;
    // }

}

module.exports = CompaniesCollection;