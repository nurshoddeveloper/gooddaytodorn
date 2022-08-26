const Moment = require('moment');
const _ = require('lodash');

const DatetimeUtils = {

    dateToMoment(yyyymmdd) {
        if (!yyyymmdd) return null;
        return Moment(yyyymmdd);
    },

    datetimeToMoment(datetime) {
        if (!datetime) return null;
        return Moment.utc(datetime).local();
    },

    isWeekend(moment) {
        return moment.day() === 0 || moment.day() === 6;
    }

};

module.exports = DatetimeUtils;