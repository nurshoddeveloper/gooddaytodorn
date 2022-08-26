const debug = {
    dev: false,
    head: "@AccessControl"
};

class AccessControl {

    constructor() {
        this.acl = require('./acl');
        this.check = require('./check-rules');
    }

    premium(orgnaizationId) {
        return gd.ac.check.company.isPremium(orgnaizationId);
    }

    getAppAccess() {
        if (debug.dev) console.log(debug.head,".get()",arguments);

        const acl = this.getACL();

        if (!acl) {
            console.error("No ACL found",gd.getApp().name);
            return false;
        }

        if (debug.dev) console.log(debug.head,"acl=",acl);

        const app = gd.getApp();

        const projectAccessName = (app.projectAccess)?gd.const.project.accessList[app.projectAccess].toLowerCase():'---';

        if (debug.dev) {
            var orgRoleName = (app.organizationRole)?gd.const.companyRoleList[app.organizationRole]:'---';
            var taskRoleName = (app.taskRole)?app.taskRole:'---';
            console.log(debug.head,"orgRole: ",orgRoleName,"     projectAccess: ",projectAccessName,"      taskRole:",taskRoleName);
        }

        let acValue;

        if (acl.taskRole) {
            acValue = acl.taskRole[this.taskRoleToAclName(app.taskRole)];
            if (acValue) {
                if (debug.dev) console.log(debug.head,"AC based on TASK role =",acValue);
                return acValue;
            }
        }

        if (acl.projectAccess) {
            acValue = acl.projectAccess[projectAccessName];
            if (acValue) {
                if (debug.dev) console.log(debug.head,"AC based on PROJECT role =",acValue);
                return acValue;
            }

        }

        if (acl.organizationRole) {
            acValue = acl.organizationRole[this.organizationRoleToAclName(app.organizationRole)];
            if (typeof(acValue)!== "undefined" && acValue!==null) {
                if (debug.dev) console.log(debug.head,"AC based on ORGANIZATION role =",acValue);
                return acValue;
            }

        }

        return false;
    }

    getACL() {

        const appSystemName = gd.getApp().name;

        if (debug.dev) console.log(debug.head,".getACL() app=",appSystemName);

        if (!appSystemName) {
            console.error("App has no name");
            return false;
        }

        const chunks = appSystemName.split("-");

        for (let i=chunks.length; i>=1; i--) {
            var subArr = chunks.slice(0,i);
            var nameToCheck = subArr.join('-');

            if (this.acl[nameToCheck]) {
                if (debug.dev) console.log(debug.head,"ACL name=",nameToCheck);
                return this.acl[nameToCheck];
            }
        }

        return false;

    }

    organizationRoleToAclName(organizationRole) {

        if (!organizationRole) return false;

        switch (organizationRole) {
            case gd.const.companyRole.MANAGER:
                return 'manager';
                break;
            case gd.const.companyRole.USER:
                return 'user';
                break;
            case gd.const.companyRole.GUEST:
            case gd.const.companyRole.CLIENT:
                return 'guest';
                break;
            default:
                console.error('AccessControl: organization role unknown or missing - ['+organizationRole+"]");
                return false;
                break;
        }
    }

    taskRoleToAclName(taskRole) {

        if (!taskRole) return false;

        switch (taskRole) {
            case gd.const.task.role.CREATOR: return 'creator'; break;
            case gd.const.task.role.ASSIGNEE: return 'assignee'; break;
            case gd.const.task.role.COLLABORATOR: return 'collaborator'; break;
            default:
                console.error('AccessControl: task role unknown or missing - ['+taskRole+"]");
                return false;
                break;
        }
    }

}


module.exports = AccessControl;