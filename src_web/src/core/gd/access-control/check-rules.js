module.exports = {

    task: {

        canSchedule(curActionRequiredUserId, projectId) {
            if (!curActionRequiredUserId) return false;

            const meId = gd.session.me.id;
            let reportsToMe = false;

            if (meId == curActionRequiredUserId) return true;

            // project full access
            const project = gd.session.projects.get(projectId);
            if (project && project.access==gd.const.project.access.FULL) return true;



            // my work chedule access
            gd.session.workScheduleAccess.models.map(wsa=>{
                if (wsa.targetUserId === curActionRequiredUserId) reportsToMe = true;
            });
            if (reportsToMe) return true;

            // report to me
            gd.session.companyUsers.map(cu=>{
                if (cu.reportToUserId === meId && cu.user.id === curActionRequiredUserId) reportsToMe = true;
            });
            if (reportsToMe) return true;

            return false;

        },

        canDeleteDuplicate(projectId, project) {
            let res = false;
            if (projectId) {

                let projectAccess = 0, companyId, sProject;
                try {
                    sProject = project ? project : gd.session.projects.get(projectId);
                    projectAccess = sProject.access;
                    companyId = sProject.companyId;
                } catch(e) {
                    console.error("Check rules task canDeleteDuplicate error:", projectId, sProject);
                }

                if (!gd.session.companies.get(companyId)) return false;

                // let organizationRole = gd.session.companies.get(companyId).role;

                res = (projectAccess >= gd.const.project.access.FULL/* ||
                    organizationRole >= gd.const.companyRole.MANAGER*/);
            }

            return res;
        }
    },

    project: {

        hasAccess(projectId) {

            let res = false;
            if (projectId) {

                const project = gd.session.projects.get(projectId);

                if (!project) return false;

                const projectAccess = project.access;
                const companyId = project.companyId;

                if (!gd.session.companies.get(companyId)) return false;

                let organizationRole = gd.session.companies.get(companyId).role;

                res = projectAccess && (projectAccess >= gd.const.project.access.LIMITED ||
                    organizationRole >= gd.const.companyRole.MANAGER);
            }

            return res;
        },

        canCreateSubproject(projectId) {
            let res = false;
            if (projectId) {

                const project = gd.session.projects.get(projectId);

                if (!project) return false;

                const projectAccess = project.access;
                const companyId = project.companyId;

                if (!gd.session.companies.get(companyId)) return false;

                res = projectAccess >= gd.const.project.access.STANDARD;
            }

            return res;
        },

        canMoveIntoRoot(projectId) {
            let res = false;
            if (projectId) {

                const project = gd.session.projects.get(projectId);

                if (!project) return false;

                const companyId = project.companyId;
                if (!gd.session.companies.get(companyId)) return false;

                let organizationRole = gd.session.companies.get(companyId).role;

                res = organizationRole >= gd.const.companyRole.MANAGER;
            }

            return res;
        },

        canDeleteDuplicate(projectId, project) {
            let res = false;
            if (projectId) {

                let projectAccess = 0, companyId, sProject;
                try {
                    sProject = project ? project : gd.session.projects.get(projectId);
                    projectAccess = sProject.access;
                    companyId = sProject.companyId;
                } catch(e) {
                    console.error("Check rules project canDeleteDuplicate error:", projectId, sProject);
                }

                if (!gd.session.companies.get(companyId)) return false;

                // let organizationRole = gd.session.companies.get(companyId).role;

                res = (projectAccess >= gd.const.project.access.FULL/* ||
                    organizationRole >= gd.const.companyRole.MANAGER*/);
            }

            return res;
        },

        standardAccess(projectId, project) {

            let res = false;
            if (projectId) {

                let projectAccess = 0, companyId, sProject;
                try {
                    sProject = project ? project : gd.session.projects.get(projectId);
                    projectAccess = sProject.access;
                    companyId = sProject.companyId;
                } catch(e) {
                    console.error("Check rules standardAccess error:", projectId, sProject);
                }

                if (!gd.session.companies.get(companyId)) return false;

                let organizationRole = gd.session.companies.get(companyId).role;

                res = (projectAccess >= gd.const.project.access.STANDARD ||
                    organizationRole >= gd.const.companyRole.MANAGER);
            }

            return res;
        },

        fullAccess(projectId, project) {
            let res = false;
            if (projectId) {

                let projectAccess = 0, companyId, sProject;

                try {
                    sProject = project ? project : gd.session.projects.get(projectId);
                    projectAccess = sProject.access;
                    companyId = sProject.companyId;
                } catch(e) {
                    console.warn("Check rules fullAccess error:", projectId, sProject);
                }

                if (!gd.session.companies.get(companyId)) return false;

                //let organizationRole = gd.session.companies.get(companyId).role;

                res = (projectAccess >= gd.const.project.access.FULL/* ||
                organizationRole >= gd.const.companyRole.MANAGER*/);
            }

            return res;
        }

    },

    company: {

        isManager(companyId) {
            let res = false;
            if (companyId){

                const companyUser = gd.session.companyUsers.findByCompanyAndUser(companyId, gd.session.me.id);

                if (companyUser && companyUser.companyRole === gd.const.companyRole.MANAGER ) {
                    res = true;
                }
            }

            return res;
        },

        isPremium(companyId) {
            const company = gd.session.companies.get(companyId);

            if (!company) return false;
            else {
                return company.isPremium;
            }
        },

        // this is a copy of can add company users... refactoring needed
        canInviteUsers(companyId) {
            let res = false;
            if (companyId){

                const companyUser = gd.session.companyUsers.findByCompanyAndUser(companyId, gd.session.me.id);

                if (companyUser && companyUser.companyRole === gd.const.companyRole.MANAGER ) {
                    res = true;
                }
            }

            return res;
        },


    },

    customField: {

        canEdit(customFieldId) {

            const customField = gd.session.customFields.get(customFieldId);

            if (!customField) return false;

            return (gd.ac.check.company.isManager(customField.companyId));
        }
    },

    isGuest(companyId) {
        const companyUser = gd.session.companyUsers.findByCompanyAndUser(companyId, gd.session.me.id);
        return (companyUser && companyUser.companyRole==gd.const.companyRole.GUEST);
    },

    canAddCompanyUsers(companyId) {
        let res = false;
        if (companyId){

            const companyUser = gd.session.companyUsers.findByCompanyAndUser(companyId, gd.session.me.id);

            if (companyUser && companyUser.companyRole === gd.const.companyRole.MANAGER ) {
                res = true;
            }
        }

        return res;
    },

    canCreateProject(companyId) {
        let res = false;
        if (companyId){
            const companyUser = gd.session.companyUsers.findByCompanyAndUser(companyId, gd.session.me.id);

            if (companyUser &&
                [
                    gd.const.companyRole.MANAGER,
                    gd.const.companyRole.USER
                ].indexOf(companyUser.companyRole) !== -1 ) { res = true; }
        }
        return res;
    },

    dashboardAllTilesAllowedRoles() {
        return [gd.const.companyRole.USER, gd.const.companyRole.MANAGER];
    },

    showNewProjectBtn() {
        return (gd.session.companies.filterByRoles([gd.const.companyRole.MANAGER,gd.const.companyRole.USER]).length>0)
    },

    showNewCompanyEventBtn() {
        return (gd.session.companies.filterByRoles([gd.const.companyRole.MANAGER,gd.const.companyRole.USER]).length>0)
    },

    showNewUserBtn() {
        let res = false;
        gd.session.companies.map(function(company){
            if (company.role>=4) res = true;
        });
        return res;
    },

    companyUsersViewAllowedRoles() {
        return [gd.const.companyRole.USER, gd.const.companyRole.MANAGER];
    },

    projectManagerCompanyAllowedRoles() {
        return [gd.const.companyRole.USER, gd.const.companyRole.MANAGER];
    },

    isOrganizationAdmin(companyId) {
        let res = false;
        if (companyId){
            const companyUser = gd.session.companyUsers.findByCompanyAndUser(companyId,gd.session.me.id);
            res = companyUser && companyUser.isAdmin;
        }
        return res;
    },

    userIntegrationsEnabled() {
        let res = false;
        gd.session.companies.map(m=>{
            if (m.isPremium) res = true;
        });
        return res;
    },

    canCreateCustomFields(projectId, options) {
        let res = false;
        if (projectId){
            let companyId;
            if (options) {
                companyId = options.companyId;
            } else {
                let project = gd.session.projects.get(projectId);
                companyId = project.companyId
            }

            let organizationRole = gd.session.companies.get(companyId).role;

            res = organizationRole >= gd.const.companyRole.MANAGER;
        }

        return res;
    },

    canEditEvent(event) {
        const { company, companyId, project, projectId, user, userId, assignedToUser, assignedToUserId, type } = event;
        const { companyUsers, me, projects } = gd.session;

        const cId =     companyId ? companyId   : (company && company.id)   ? company.id    : null;
        const pId =     projectId ? projectId   : (project && project.id)   ? project.id    : null;
        let uId =       userId    ? userId      : (user && user.id)         ? user.id       : null;
        if (!uId){
            uId = assignedToUserId ? assignedToUserId : (assignedToUser && assignedToUser.id) ? assignedToUser.id : null;
        }

        const companyUser = companyUsers.findByCompanyAndUser(cId, me.id);

        let result = false;

        if (companyUser && companyUser.companyRole === gd.const.companyRole.MANAGER) result = true;
        else if (type <= 5) { // project event
            const project = projects.get(pId);

            if (uId === me.id) result = true;                                   // assigned to cur user
            if (project.access === gd.const.project.access.FULL) result = true; // full project access

        } else if (type >= 20 && type <= 25) { // Personal event
            if (me.id === uId) result = true
        }

        return result;
    }


};