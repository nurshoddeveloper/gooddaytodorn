import StructureControl from '../../../core/gd/structure-control/structure-control';

import _ from 'lodash';

class MoveTreeOptions {

    // EVERY ITEM CAN BE DISABLED !!!! - not selectable but show to reflect structure

    constructor(companyId) {
        const { MANAGER, USER } = gd.const.companyRole;
        this.companies = companyId ? [companyId] :  gd.session.companies.filterByRoles([MANAGER,USER]).map(c=>c.id);
    }

    _filterTreeItemsPlain(filterFunction) {
        const result = [];

        gd.session.projects.map(p=>{
            if (this.companies.includes(p.companyId) && filterFunction(p).selectable) {
                result.push(p)
            }
        });

        return result;
    }

    _filterTreeItems(fiterFunction) {
        const result = [];

        const recursiveCollectChildren = (p,ch)=>{
            p.children && p.children.sortedByName.map(c=>{
                const { selectable, visible } = fiterFunction(c);

                if(visible) {
                    const children = [];
                    recursiveCollectChildren(c, children);

                    ch.push({
                        project: c,
                        selectable: selectable,
                        children: children
                    });
                }
            });
        };

        this.companies.map(cId=>{
            const company = gd.tree.getCompany(cId);
            const projects = [];
            company.projects.sortedByName.map(p=>{
                const { selectable, visible } = fiterFunction(p);

                if(visible) {
                    const children = [];
                    recursiveCollectChildren(p, children);
                    projects.push({
                        project: p,
                        selectable: selectable,
                        children: children
                    });
                }
            });

            result.push({
                company: company,
                projects: projects
            });
        });

        return result;
    }

    _getAllowedParentTypesForProjectsToMoveInto(projectsIds /*array*/) {
        const { newParentOptions } = StructureControl;

        let uniqueSystemTypes = [];
        projectsIds.map(pId=>{
            uniqueSystemTypes = _.union(uniqueSystemTypes,
                [gd.tree.getProject(pId).systemType].concat(gd.tree.findProjectChildren(pId).map(c=>c.systemType)));
        });

        let allowedProjectTypes = newParentOptions();
        uniqueSystemTypes.map(systemType=> allowedProjectTypes = _.intersection(allowedProjectTypes, newParentOptions(systemType)));

        return allowedProjectTypes;
    }

    /******* TASK *********/

    moveTask(options = {}) {
        const { projectsPlain } = options;
        const allowedParentTypes = StructureControl.newParentOptions("task");

        const filterFunction = (m)=>{
            const visible = allowedParentTypes.indexOf(m.systemType) !== -1;
            return {
                selectable: visible,
                visible: visible
            }
        };

        let res;
        if (projectsPlain) res = this._filterTreeItemsPlain(filterFunction);
        else res = this._filterTreeItems(filterFunction);

        return res;
    }

    /******* PROJECT *********/

    moveProject(projectId, options = {}) {
        const { projectsPlain } = options;
        // const allowedParentTypes = this._getAllowedParentTypesForProjectsToMoveInto([projectId]);

        const filterFunction = (m)=>{
            // const bySystemType = allowedParentTypes.indexOf(m.systemType) !== -1;
            const allParents = gd.tree.findProjectParents(gd.tree.getProject(m.id)).map(p=>p.id);
            const isNotMovedProject = !([m.id].concat(allParents).includes(projectId)) ;
            const visible = /*bySystemType &&*/ isNotMovedProject;

            return {
                selectable: visible,
                visible: visible
            }
        };

        let res;
        if (projectsPlain) res = this._filterTreeItemsPlain(filterFunction);
        else res = this._filterTreeItems(filterFunction);

        return res;
    }

    /******* MULTI *********/

    moveMulti(tasksIds, projectsIds, options = {}) {
        const { projectsPlain } = options;
        // let aPT = StructureControl.newParentOptions();

        // if (tasksIds) aPT = aPT.concat(StructureControl.newParentOptions("task"));
        // if (projectsIds)  aPT = _.intersection(aPT, this._getAllowedParentTypesForProjectsToMoveInto(projectsIds));

        const filterFunction = (m)=>{
            // const bySystemType = aPT.indexOf(m.systemType) !== -1;
            const allParents = gd.tree.findProjectParents(gd.tree.getProject(m.id)).map(p=>p.id);
            let isNotOneOfMovedProjects = !projectsIds || _.intersection([m.id].concat(allParents), projectsIds).length === 0;
            const visible = /*bySystemType &&*/ isNotOneOfMovedProjects;

            return {
                selectable: visible,
                visible: visible
            }
        };

        let res;
        if (projectsPlain) res = this._filterTreeItemsPlain(filterFunction);
        else res = this._filterTreeItems(filterFunction);

        return res;
    }
}


module.exports = MoveTreeOptions;