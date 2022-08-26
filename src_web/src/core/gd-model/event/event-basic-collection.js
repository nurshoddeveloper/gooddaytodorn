const AmpersandCollection = require('ampersand-collection');
const EventBasicModel = require('./event-basic');

const _ = require('lodash');

const EventsCollection = AmpersandCollection.extend({
    model: EventBasicModel,

    initialize: function (models) {
    },

    findUsersFilterValues() {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return [];

        let result = {};

        this.models.forEach(m=>{
            const { userId, assignedToUserId } = m;
            if(userId) {
                const user = gd.session.users.get(userId);
                if (user) {
                    if (!result[userId]) {
                        result[userId] = {
                            counter: 0,
                            item: user
                        };
                    }

                    result[userId]['counter']++;
                }
            }

            if(assignedToUserId) {
                const user = gd.session.users.get(assignedToUserId);
                if (user) {
                    if (!result[assignedToUserId]) {
                        result[assignedToUserId] = {
                            counter: 0,
                            item: user
                        };
                    }

                    result[assignedToUserId]['counter']++;
                }
            }
        });

        return _.sortBy(result,'counter');
    },

    findProjectFilterValues() {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return [];

        let result = {};

        this.models.forEach(m=>{
            const { projectId } = m;
            if(projectId) {
                if (!result[projectId]) {
                    result[projectId] = {
                        counter: 0,
                        item: gd.session.projects.get(projectId)
                    };
                }

                result[projectId]['counter']++;
            }
        });

        return _.sortBy(result,'counter');
    },

    findByDay(moment) {
        return this.filter(m=>moment.isBetween(m.startDate,m.endDate))
    },

    filterByCompany(companyId){
        return new EventsCollection(this.filter(e=>e.companyId === companyId),{});
    },

    filterByEventTypes(typesArray){
        return new EventsCollection(this.filter(e=>typesArray.indexOf(e.type) !== -1),{});
    },

    filterByTypes(typesArray){
        return new EventsCollection(this.filter(e=>typesArray.indexOf(e.scope) !== -1),{});
    },

    filterByUser(userId){
        return new EventsCollection(this.filter(e=>e.userId === userId),{});
    },

    exportToFullCalendar(){
        return this.models.map(e=>e.toFullCalendar());
    }

});

module.exports = EventsCollection;