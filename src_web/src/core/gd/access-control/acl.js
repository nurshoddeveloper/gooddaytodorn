module.exports = {


    'project': {

        projectAccess: {
            full: 'rw',
            standard: 'rw',
            limited: 'rw'
        },

        organizationRole: {
            manager: 'rw',
            user: false,
            guest: false
        }

    },

    'project-users': {

        projectAccess: {
            full: 'rw',
            standard: false,
            limited: false
        },

        organizationRole: {
            manager: 'rw',
            user: false,
            guest: false
        }

    },

    'project-settings': {

        projectAccess: {
            full: 'rw',
            standard: false,
            limited: false
        },

        organizationRole: {
            manager: 'rw',
            user: false,
            guest: false
        }

    },

    'user': {
        organizationRole: {
            manager: 'rw',
            user: 'r',
            guest: false
        }
    },

    'user-settings': {
        organizationRole: {
            manager: 'rw',
            user: false,
            guest: false
        }
    },

    'task-view': {

        projectAccess: {
            full: 'rw',
            standard: 'rw',
            limited: false //'rw'
        },

        organizationRole: {
            manager: 'rw',
            user: false,
            guest: false
        },

        taskRole: {
            creator: 'rw',
            assignee: 'rw',
            collaborator: 'rw'
        }

    },

    'group-view': {

        projectAccess: {
            full: 'rw',
            standard: 'rw',
            limited: false //'rw'
        },

        organizationRole: {
            manager: 'rw',
            user: false,
            guest: false
        }

    },

    'organization': {
        organizationRole: {
            manager: 'rw',
            user: 'r',
            guest: 'r'
        }
    },


    'organization-settings-delete-account': {
        organizationRole: {
            // admin: 'rw', -- need to implement (!) for now use checkIfAdmin
            manager: 'rw',
            user: false,
            guest: false
        }
    },




};