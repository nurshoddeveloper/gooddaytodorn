const AmpersandModel = require('ampersand-model');
const Moment = require('moment');
const React = require('react');

const EventBasic = AmpersandModel.extend({

    props: {
        id: 'string',
        type: 'number',
        isAccomplished: 'boolean',
        name: 'string',
        notes: 'string',
        startDate: 'object',
        endDate: 'object',

        userId: 'string',
        projectId: 'string',
        companyId: 'string',
        assignedToUserId: 'string'
    },

    derived: {

        scope: {
            deps: ['type'],
            fn: function() {
                if (this.type>0 && this.type<10) return 'project';
                if (this.type>=10 && this.type<20) return 'organization';
                if (this.type>=20 && this.type<30) return 'personal';
                if (this.type>=30) return 'task';
            }
        },

        pastdue: {
            deps: ['startDate'],
            fn: function() {
                return (this.startDate.isBefore(Moment(),'days'));
            }
        },

        isProject: {
            deps: ['type'],
            fn: function() {
                return (this.type>0 && this.type<10);
            }
        },

        isOrganization: {
            deps: ['type'],
            fn: function() {
                return (this.type>=10 && this.type<20);
            }
        },

        isPersonal: {
            deps: ['type'],
            fn: function() {
                return (this.type>=20 && this.type<30);
            }
        }
    },

    initFromSession(){
        if (this.companyId)         this.company = gd.session.companies.get(this.companyId);
        if (this.projectId)         this.project = gd.session.projects.get(this.projectId);
        if (this.userId)            this.user = gd.session.users.get(this.userId);
        if (this.assignedToUserId)  this.assignedToUser = gd.session.users.get(this.assignedToUserId);
    },

    toFullCalendar: function(){

        return {
            id: this.id,
            title: this.name,
            allDay: true,
            start: this.startDate,
            end: this.endDate ? Moment(this.endDate).add(1,'day') : null,
            eventObject: this,
            startEditable: gd.ac.check.canEditEvent(this)
        }
    },

    parse(obj) {

        obj.startDate = Moment(obj.startDate);
        obj.endDate = (obj.endDate)?Moment(obj.endDate):null;

        return obj;
    }

});

module.exports = EventBasic;