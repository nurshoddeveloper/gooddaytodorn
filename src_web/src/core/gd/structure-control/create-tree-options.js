import StructureControl from '../../../core/gd/structure-control/structure-control';

class CreateTreeOptions {

    // EVERY ITEM CAN BE DISABLED !!!! - not selectable but show to reflect structure

    constructor(companies, options = {}) {
        this.filterByAccess = !!options.filterByAccess;

        const { MANAGER, USER } = gd.const.companyRole;
        this.companies = companies ? companies :  gd.session.companies.filterByRoles([MANAGER,USER]).map(c=>c.id);
    }

    _filterTreeItems(treeSource, fiterFunction) {
        const source = treeSource ? treeSource : gd.tree;
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
            const company = source.getCompany(cId);
            const projects = [];
            const treeProjects = this.filterByAccess ? company.projects.mainMenuProjects : company.projects.sortedByName;
            treeProjects.map(p=>{
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

    /******* TASK *********/

    newTask(treeSource) {
        const allowedParentTypes = StructureControl.newParentOptions("task");
        return this._filterTreeItems(treeSource, (m)=>{
            const visible = allowedParentTypes.indexOf(m.systemType) !== -1;
            return {
                selectable: visible,
                visible: visible
            }
        });
    }

    /******* PROJECT *********/

    newProject(projectSystemType, accessLevels, treeSource) {
        const allowedParentTypes = StructureControl.newParentOptions(projectSystemType);
        return this._filterTreeItems(treeSource, (m)=>{
            const bySystemType = allowedParentTypes.indexOf(m.systemType) !== -1;
            const byAccessLevel = !accessLevels || accessLevels.includes(m.access);
            const visible = bySystemType && byAccessLevel;

            return {
                selectable: visible,
                visible: visible
            }
        });
    }
}


module.exports = CreateTreeOptions;