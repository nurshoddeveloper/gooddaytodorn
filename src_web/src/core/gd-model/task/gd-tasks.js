const AmpersandCollection = require('ampersand-collection');
const GDTask = require('./gd-task');
const _ = require('lodash');
const Moment = require( "moment" );

const GDTasks = AmpersandCollection.extend({
    model: GDTask,

    initialize: function (models) {
    },

    filterByCreatedUser: function(userId) {
        return new GDTasks(this.filter(function(m){
            return (m.createdByUser && m.createdByUser.id == userId);
        }));
    },

    filterByActionRequiredUser: function(userId) {
        return new GDTasks(this.filter(function(m){
            return (m.actionRequiredUser && m.actionRequiredUser.id == userId);
        }));
    },
    
    findStatusFilterValues: function() {

        if (!this.models || !this.models[0] || !this.models[0]['id']) return {}

        var result = {
            open: {
                counter: 0,
                item: 'Open'
            },
            active: {
                counter: 0,
                item: 'Active'
            },
            someday: {
                counter: 0,
                item: 'Someday'
            },
            closed: {
                counter: 0,
                item: 'Closed'
            },
            all: {
                counter: 0,
                item: 'All Tasks'
            }
        };

        this.models.forEach(function(m) {

            if (m.isOpen) {
                result.open.counter++;

                if (m.scheduleStatus==2) result.someday.counter++;
                else result.active.counter++
            } else {
                result.closed.counter++;
            }

            result.all.counter++;
        });

        var arrRes = _.sortBy(result,'counter');
        return arrRes.reverse();
    },

    findAllProjects: function() {

        var objRes = this.findFilterOptions('project');

        var arrRes = _.sortBy(objRes,'counter');

        return arrRes;
    },

    findCompanyFilterValues: function() {
        var objRes = this.findFilterOptions('company');
        var arrRes = _.sortBy(objRes,'counter');

        var companiesFound = {};
        arrRes.map(function(rec){
            companiesFound[rec.item.id] = true;
        });

        gd.session.companies.map(function(company){
            if (!companiesFound[company.id]) {
                arrRes.push({
                    counter: 0,
                    item: company
                });
            }

        });

        return arrRes;
    },

    findCameFromUserFilterValues: function() {
        var objRes = this.findFilterOptions('cameFromUser');
        var arrRes = _.sortBy(objRes,'counter');
        return arrRes;
    },

    findCreatedBy: function() {
        var objRes = this.findFilterOptions('createdByUser');

        var arrRes = _.sortBy(objRes,'counter');

        return arrRes;
    },

    findCreatedFor: function() {
        var objRes = this.findFilterOptions('createdForUser');
        var arrRes = _.sortBy(objRes,'counter');
        return arrRes;
    },

    findActionRequired: function() {
        var objRes = this.findFilterOptions('actionRequiredUser');
        var arrRes = _.sortBy(objRes,'counter');
        return arrRes;
    },

    findActionPendingFilterOptions() {
        var result = {};
        if (!this.models || this.models.length<1 || !this.models[0]['id']) return [];

        this.models.forEach(function(m){

            var key = m.actionPendingSinceFilter;

            if (m.actionPendingSince){
                if (!result[key]) {
                    result[key] = {
                        counter: 0,
                        timestamp: m.actionPendingSince.format("X")
                    };
                    result[key]['item'] = key;

                } else {

                }

                result[key]['counter']++;
            }

        });

        var objRes = result;
        var arrRes = _.sortBy(objRes,'timestamp');

        return arrRes.reverse();
    },

    findRecentActivityFilterValues: function() {

        var result = {};
        if (!this.models || this.models.length<1 || !this.models[0]['id']) {
            return [];
        }

        this.models.forEach(function(m){

            var key = m.recentActivityFilter;

            if (!result[key]) {
                result[key] = {
                    counter: 0,
                    timestamp: m.dateCreated.format("X")
                };
                result[key]['item'] = key;

            } else {
                //
            }

            result[key]['counter']++;
        });

        var objRes = result;
        var arrRes = _.sortBy(objRes,'timestamp');
        return arrRes.reverse();
    },

    findDateFilterOptions: function() {

        var result = {};

        var keys = {
                all:{id:0, name:'All active'},
                someday:{id:1, name:'Someday'}
            };

        Object.keys(keys).forEach(function(k){
            result[keys[k].id] = {
                counter: 0
            };
            result[keys[k].id]['item'] = keys[k].name;
            result[keys[k].id]['order'] = keys[k].id;
            result[keys[k].id]['counter'] = 0;
        });

        if (this.models && this.models.length>0 && this.models[0]['id']) {
            var currentDay = Moment().format("YYYY DDD");

            this.models.forEach(function(m){
                var key;

                switch (m.scheduleStatus){
                    case 0:
                    case 1:
                        key = keys.all.id;
                        break;

                    case 2:
                        key = keys.someday.id;
                        break;

                    default:
                        //console.log("findDateFilterOptions: can't define key, default 'Inbox'", m.scheduleStatus);
                        key = 0;
                        break;
                }

                result[key]['counter']++;
            });
        }

        var arrRes = _.sortBy(result,'order');

        return {items:arrRes, keys:keys};
    },

    findLifeTimeFilterOptions: function() {

        var result = {};

        if (!this.models || this.models.length<1 || !this.models[0]['id']) {
            return [];
        }

        this.models.forEach(function(m){
            var key = m.lifeTimeFilter;

            if (!result[key]) {
                result[key] = {
                    counter: 0,
                    timestamp: m.dateCreated.format("X")
                };
                result[key]['item'] = key;

            } else {
                //console.log("object oalready there");
            }

            result[key]['counter']++;
        });

        var arrRes = _.sortBy(result,'timestamp').reverse();

        return arrRes;
    },

    findFilterOptions: function(field) {
        var result = {};

        if (!this.models || !this.models[0] || !this.models[0]['id']) {
            return {};
        }

        this.models.forEach(function(m){

            let tempItem;
            if (!m[field]) {
                //skip null objects... it's possible i.e. actionrequired = null
                //filter.jsx can now handle null items
                tempItem = {id:'id-hidden'};
                //return;
            } else {
                tempItem = m[field]
            }

            if (!result[tempItem.id]) {
                result[tempItem.id] = {
                    counter: 0
                };
                result[tempItem.id]['item'] = tempItem;

            } else {
                //console.log("object oalready there");
            }

            result[tempItem.id]['counter']++;
        });

        return result;
    }

});

module.exports = GDTasks;