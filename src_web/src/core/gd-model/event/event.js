const EventBasic = require('./event-basic');
const UserBasic = require('../user/gd-user-basic');
const CompanyBasic = require('../company/company-basic');

const Moment = require('moment');

const GDEvent = EventBasic.extend({
    props: {
        user: 'object',
        project: 'object',
        company: 'object',

        task: 'object'
    },

    children: {
        assignedToUser: UserBasic
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

    parse(obj){
        EventBasic.prototype.parse.apply(this,[obj]);

        obj.user = (obj.user && obj.user.id)?new UserBasic(obj.user):null;
        //
        // if (obj.project) obj.project = new ProjectBasic(obj.project);
        if (obj.company) obj.company = new CompanyBasic(obj.company);

        return obj;
    }
});

module.exports = GDEvent;
