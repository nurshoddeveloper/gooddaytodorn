const _ = require('lodash');

// PROJECT FIELDS:
//
// color
// companyId
// icon
// id
// name
// parent ????
// parentId - parent project id
// role - user's role in project (access needed)
// shortName
// systemStatus
// systemType


class ProjectsCollection {

    constructor(context, data, parentProject) {

        const tempArr = data.slice(0);
        this._models = [];

        tempArr.map(el=>{
            if (el.children && el.children.length>0) {
                el.children = new ProjectsCollection(context, el.children, el);
            }
            el.parent = parentProject;
            this._models.push(el);

            // add project to tree
            context._projectsById[el.id]=el;
        });

        this.remap();
    }

    get mainMenuProjects() {

        this.menuProjects = [];

        this._recursiveMenuFinder(this._models);

        this.menuProjects = _.sortBy(this.menuProjects, 'name');

        return this.menuProjects;
    }

    _recursiveMenuFinder(projects) {
        if (projects) {
            projects.forEach(project=>{
                if (project.access) {
                    this.menuProjects.push(project);
                } else {
                    if (project.children) {
                        this._recursiveMenuFinder(project.children._models);
                    }
                }
            })
        }
    }

    get sortedByName() {
        return _.sortBy(this._models, 'name');
    }

    get(id) {
        return this._byId[id];
    }

    remap() {

        this._byId = {};
        this._models.map(el=>{
            this._byId[el.id] = el;
        })

    }

    list() {
        return this._models;
    }

}

module.exports = ProjectsCollection;