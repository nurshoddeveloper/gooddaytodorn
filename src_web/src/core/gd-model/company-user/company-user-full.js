const CompanyUserBasicModel = require('./company-user');

module.exports = CompanyUserBasicModel.extend({
    props: {

        maxPastDueHours: 'number',
        requiredReporTimeMinutes: 'number',

        workWeek: 'object',
        workDayDuration: 'number',

        userEmail: 'string',

        guesstimate: {
            type: 'boolean',
            default: false
        },

        dailyBadge: {
            type: 'boolean',
            default: false
        }

    },

    parse(obj) {


        if (obj.workWeek) {
            //var workWeekResult = {};
            var workDurationResult = 0;

            var days = ['mon','tue','wed','thu','fri','sat','sun'];
            days.map(function(dayName){
                if (obj.workWeek[dayName]>workDurationResult) workDurationResult = obj.workWeek[dayName];
                //workWeekResult[dayName] = (obj.workWeek[dayName]>0);
            });

            //obj.workWeek = workWeekResult;
            obj.workDayDuration = workDurationResult;
        }

        if (obj.workDays) {
            var workWeekResult = {};

            var days = ['mon','tue','wed','thu','fri','sat','sun'];
            days.map(function(dayName,key){
                workWeekResult[dayName] = (obj.workDays[key]==1);
            });

            obj.workWeek = workWeekResult;
        }


        return obj;
    }
});

