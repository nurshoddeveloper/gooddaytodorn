const Moment = require('moment');
const _ = require('lodash');

const debug = {
    error: false,
    dev: false,
    head: "GD.Utils"
};

import Format from "./format.js";

const GDUtils = {

    Format: Format,

    objectToOptions(obj) {

        var res = [];

        _.forEach(obj,function(label,key) {

            var value = key;
            if (parseInt(key)>=0) value = parseInt(key);

            res.push({
                value: value,
                label: label
            });

        });
        return res;
    },

    nameColor(name) {

        const letter = gd.utils.initials(name,1).toLowerCase();

        if (gd.const.alphabetColors[letter]) {
            return gd.const.alphabetColors[letter];
        } else {
            return gd.const.alphabetColors.a;
        }

    },

    nameColorClass(name) {
        const letter = gd.utils.initials(name,1).toLowerCase();
        return gd.const.alphabetColors[letter] ? letter : "a";
    },


    getDefaultView(systemType, value = null) {
        const { PROJECT, WORKFOLDER, BACKLOG, SPRINT, TAG } = gd.const.project.type;

        let res = value;

        switch(systemType){
            case PROJECT:       if(!res) res = "tasks_list"; break;
            case WORKFOLDER:    if(!res) res = "tasks_list"; break;
            case BACKLOG:       if(!["tasks_list","board","summary"].includes(res)) res = "tasks_list"; break;
            case SPRINT:        if(!res) res = "board"; break;
            case TAG:           if(!["tasks_list","board","summary"].includes(res)) res = "tasks_list"; break;
            default:            res = "tasks_list"; break;
        }

        return res ? res : "tasks_list";
    },

    //workflowColor(number) {
    //    switch (number) {
    //        case 1: return "#7bbf34"; break;
    //        case 2: return "#42bce4"; break;
    //        case 3: return "#f1db26"; break;
    //        case 4: return "#f85c73"; break;
    //        case 5: return "#3dcbb7"; break;
    //        case 6: return "#a654dc"; break;
    //        case 7: return "#f9a849"; break;
    //        case 8: return "#6683d5"; break;
    //    }
    //},

    formatMenuCounter(total,isItNewCounter) {
        if (total<10 && isItNewCounter) {
            return "+"+total;
        }
        if (total>99) {
            return "99+";
        }
        return total;
    },

    strToTitleCase: function(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },


    howOldFormatted: function(creationMoment) {

        console.error('depricated - utils.hodOld');

        if (creationMoment._isUTC==false) creationMoment = Moment.utc(creationMoment);

        var ms = Moment.utc().diff(creationMoment);

        var duration = Moment.duration(ms);


        if (duration.months()>3) return duration.months()+"+ months ago";
        if (duration.days()>1) return duration.days()+" days ago";
        if (duration.days()==1) return "Yesterday";
        return "Today";

        /*var s = Math.floor(duration.asHours()) + Moment.utc(ms).format(":mm:ss");

        return s;*/
    },

    localMoment(momentUTC) {

        console.error("Depricated");

        if (momentUTC._isUTC==false) {
            if (debug.error) console.warn(debug.head,".localMoment() Passed argument is not UTC",momentUTC);
            momentUTC = Moment.utc(momentUTC);
        }

        return momentUTC.tz(gd.session.me.timezone);
    },

    momentIntervalHumanize(momentInterval) {

        if (momentInterval.years()>0) return (momentInterval.years()>1)?momentInterval.years()+" years":momentInterval.years()+"1 year";

        if (momentInterval.months()>0 || momentInterval.days()>0) return (momentInterval.asDays()>1)?Math.round(momentInterval.asDays())+" days":"1 day";

        if (momentInterval.hours()>0) return (momentInterval.hours()>1)?momentInterval.hours()+" hours":"1 hour";

        if (momentInterval.minutes()>1) return momentInterval.minutes()+" min";

        return "1 min";
    },

    momentHumanize(moment,format) {

        var localNow = Moment();

        if (localNow.isSame(moment, 'day')) {
            return "Today";
        }

        var localYesterday = Moment().subtract(1,"days");
        if (localYesterday.isSame(moment, 'day')) {
            return "Yesterday";
        }

        var localTomorrow = Moment().add(1,"days");
        if (localTomorrow.isSame(moment, 'day')) {
            return "Tomorrow";
        }

        return moment.format(format);

    },

    localWhen: function(moment) {

        var agoString = "";
        //var agoString = " ago";

        if (moment._isUTC==true) {
            if (debug.error) console.warn(debug.head,".localWhen() Passed argument is  UTC",moment);
            moment.local();
        }

        var localMoment = moment; //gd.utils.localMoment(momentUTC);
        var localNow = Moment(); //gd.utils.localMoment(Moment.utc());

        //check if today
        if (localNow.isSame(localMoment, 'day')) {
            return "Today";
        }

        // check if yesterday
        var localYesterday = Moment().subtract(1,"days"); //gd.utils.localMoment(Moment.utc().subtract(1,"days"));
        if (localYesterday.isSame(localMoment, 'day')) {
            return "Yesterday";
        }

        var diff = Moment.duration(localNow.diff(localMoment)); // 'a month'
        var diffYears = diff.years();
        var diffMonths = diff.months();
        var diffDays = diff.days();

        var resultString = "";
        if (diffYears>0) {
            resultString = diffYears+"y";
            if (diffMonths>0) resultString+=" "+diffMonths+"m";
            return resultString + agoString;
        }

        if (diffMonths>0) {
            resultString = diffMonths+"m";
            if (diffDays>0) resultString+=" "+diffDays+"d";
            return resultString + agoString;
        }

        if (diffDays<2) diffDays = 2; //hack-fix becuase if it was yesterday it would be there and when we compare we dont' check hours
        return diffDays+" days" + agoString;
    },

    // nl2br: function(str, is_xhtml) {
    //     var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    //     return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    // },

    initials(str,max) {
        if (!str) return ''; //andrew
        let arr = str.trim().split(" ");
        let res = arr[0][0];
        if (max>1 && arr[1]) res+=arr[1][0];
        if (max>2 && arr[2]) res+=arr[2][0];

        return res.toUpperCase();
    },

    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    /**
     * Returns random number between min & max
     * @param max
     * @param min
     * @returns {number}
     */
    randomInt(max = 1000, min = 300) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    humanTime(value, type = GDUtils.TYPE_MINUTES) {

        var humanTime = '';

        switch (type) {
            case this.TYPE_MINUTES:
                var duration = Moment.duration(value, 'minutes');
                if (duration.asHours() < 1) {
                    humanTime = duration.minutes() + 'm';
                } else if (duration.asDays() < 1) {
                    humanTime = duration.hours() + 'h ' + duration.minutes() + 'm';
                } else if (duration.asDays() > 1 && duration.asDays() <= 15) {
                    humanTime = duration.days() + 'd ' + duration.hours() + 'h';
                } else {
                    humanTime = Math.floor(duration.asDays()) + ' days'
                }
                return humanTime;
                break;
            case this.TYPE_SECONDS:
                humanTime = (Math.floor(value / 60) ? Math.floor(value / 3600) + 'h ' : '') + Math.ceil(Math.floor(value / 60) % 60) + 'm';
                break;
            case this.TYPE_HOURS:
                humanTime = value + 'h';
                break;
            default:
                console.warn('Undefined type of human time');
                break;
        }

        return humanTime;
    },

    humanTimeShort(value, type = GDUtils.TYPE_MINUTES) {

        var humanTime = '';

        switch (type) {
            case this.TYPE_MINUTES:
                if (value < 60) {
                    humanTime = (Math.floor(value / 60) ? Math.floor(value / 60) + 'h ' : '') + Math.ceil(value % 60) + 'm';
                }
                humanTime = (Math.floor(value / 60) ? Math.floor(value / 60) + 'h ' : '') + Math.ceil(value % 60) + 'm';
                break;
            case this.TYPE_SECONDS:
                humanTime = (Math.floor(value / 60) ? Math.floor(value / 3600) + 'h ' : '') + Math.ceil(Math.floor(value / 60) % 60) + 'm';
                break;
            case this.TYPE_HOURS:
                humanTime = value + 'h';
                break;
            default:
                console.warn('Undefined type of human time');
                break;
        }

        return humanTime;
    },

    /**
     * Display +[plus] before int
     * @param number
     * @returns {string}
     */
    displayNumber(number) {
        return (number > 0 ? '+' : '') + number;
    },

    /**
     * Test data to compose dateRange API object {{data: value, data: value}}
     * @param dateRange
     * @param max
     * @param min
     * @returns {{}}
     */
    dateRangeData: function (dateRange, max = 100, min = 1) {
        var result = {};

        dateRange.by('days', moment => {
            var dateFormatted = moment.format('YYYY-MM-DD');
            result[dateFormatted] = gd.utils.randomInt(max, min);
        });

        return result;
    },

    minutesHumanize(minutes) {

        const m = minutes % 60;
        const h = (minutes - m)/60;

        if (h<1) return m+" minutes";
        if (m<1) return (h>1)?h+" hours":"1 hour";
        return h + "h. "+ m +"m.";
    },

    minutesHumanizeWithDays(minutes) {

        var h=0, m=0, d=0;

        m = minutes % 60;

        var roundHours = (minutes - m)/60;

        if (roundHours>24) {

            h = roundHours % 24;
            d = (roundHours-h)/24;

        } else {
            h = roundHours;
        }

        var res;

        if (d>0) {
            res = d + "d.";
            if (h>0) res+=" "+h+" h.";
            return res;
        } else {
            if (h<1) return m+" minutes";
            if (m<1) return h+" hours";
            return h + "h. "+ m +"m.";
        }



    },

    minutesToHM(minutes) {

        var mins = minutes%60;
        var hours = (minutes-mins)/60;

        return {hours,mins}
    },

    minutesToHMStr(minutes) {
        var {hours,mins} = gd.utils.minutesToHM(minutes);

        var res = "";

        if (hours) res+=hours+"h. ";
        if (mins) res += mins+"m.";

        return res;
    },

    roundNumberTo05(number) {
        var lastDigit = number % 10;

        var main = (number - lastDigit) / 10;



        if (lastDigit<3) lastDigit = 0;
        else if (lastDigit<8) lastDigit = 5;
        else if (lastDigit>=8) {
            lastDigit = 0;
            main+=1;
        }

        var res = main * 10 + lastDigit;
        return res;
    },

    roundToDecimals(number, decimals = 0) {
        const multiplier = Math.pow(10,decimals);
        return Math.round(number * multiplier)/multiplier;
    },

    calculateChangePercentage(oldValue, newValue) {
        return Math.ceil((newValue - oldValue)/ (oldValue/100));
    },

    momentToDate(moment) {
        if (moment) return moment.format("YYYY-MM-DD");
        else return null;
    },

    generateShortName(name) {
        let arr = name ? name.split(" ") : [];

        let shortName = "";
        arr && arr.map((word, key) => {
            if (key >= 3 || !word[0]) return;
            shortName += word[0].toUpperCase();
        });

        return shortName;
    },

    leadingZero(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    },

    toggleArrayValue(arr, value, options) {
        let newArr = arr.slice();
        if (newArr.includes(value)) newArr.remove(value);
        else newArr.push(value);

        if (options && options.mandatorySelection && newArr.length === 0) newArr = arr.slice();

        return newArr;
    },

    toggleArrayObject(arr, object, searchFunc, options) {
        let newArr = arr.slice();
        const found = newArr.find(searchFunc);
        if (found) newArr.remove(found);
        else newArr.push(object);

        if (options && options.mandatorySelection && newArr.length === 0) newArr = arr.slice();

        return newArr;
    },


    addValueToArray(array, value) {
        if (value && !array.includes(value)) {
            array.push(value);
        }

        return array;
    },

    removeValueFromArray(array, value) {
        const index = array.indexOf(value);
        if (index !== -1) {
            array.splice(index, 1);
        }

        return array;
    },

    getFileSize(size, asObject=false) {
        let cutoff, i, selectedSize, selectedUnit, unit, units, _i, _len;
        selectedSize = 0;
        selectedUnit = "b";
        if (size > 0) {
            units = ['Tb', 'Gb', 'Mb', 'Kb', 'b'];
            for (i = _i = 0, _len = units.length; _i < _len; i = ++_i) {
                unit = units[i];
                cutoff = Math.pow(1024, 4 - i) / 10;
                if (size >= cutoff) {
                    selectedSize = size / Math.pow(1024, 4 - i);
                    selectedUnit = unit;
                    break;
                }
            }
            selectedSize = Math.round(10 * selectedSize) / 10;
        }

        if (asObject) {
            return {
                value: selectedSize,
                units: selectedUnit
            }
        } else {
            return selectedSize + "" + selectedUnit;
        }
    },

    openCenteredWindow(url, title, w, h) {
        // Fixes dual-screen position                               Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft  : screen.left;
        const dualScreenTop =   window.screenTop !== undefined ? window.screenTop   : screen.top;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const left = ((width / 2) - (w / 2)) + dualScreenLeft;
        const top = ((height / 2) - (h / 2)) + dualScreenTop;
        const newWindow = window.open(url, title,
            'directories = 0, titlebar = 0, toolbar = 0, location = url, ' +
            'status = 0, menubar = 0, scrollbars = false, resizable = false, ' +
            'width = ' + w + ', height = ' + h + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
            newWindow.focus();
        }
    },

   checkIsArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
   },

    valueChecker(a, b, strict = false){
        const { checkIsArray } = gd.utils;
        let result;
        if (checkIsArray(b)) {
            if (checkIsArray(a)) {
                result = strict ? _.intersection(b,a).length === b.length : _.intersection(b,a).length > 0;
            } else {
                result = b.includes(a);
            }
        } else {
            result = checkIsArray(a) ? a.includes(b) : b === a;
        }
        return result;
    },

    compare(n1,n2) {
        return n1.trim().toLowerCase() === n2.trim().toLowerCase();
    },

    formatTimeSpent(minutes, roundHours=40, delimiterHours=1000) {
        let { hours, mins } = gd.utils.minutesToHM(parseInt(minutes));
        if (hours >= roundHours) {
            if (mins >= 30) hours++;
            mins = 0;
        }
        if (hours >= delimiterHours) {
            hours = hours.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        let res = '';
        if (hours) res = hours + 'h. ';
        if (mins) res += mins + 'm.';
        return res;
    },

    numberOfWeekdaysBetween(d1, d2, isoWeekdays = [1,2,3,4,5]) {
        const date1 = Moment(d1);
        const date2 = Moment(d2);
        let current = date1.clone();
        let count = 0;
        while (current.isBefore(date2, 'day') || current.isSame(date2, 'day')) {
            if (isoWeekdays.includes(current.isoWeekday())) count++;
            current.add(1,'day');
        }

        return count;
    },

    addWeekdays(date, days, isoWeekdays = [1,2,3,4,5]) {
        let currentDate = Moment(date);
        if (days === 0) {/*do nothing*/}
        else if (days > 0) {
            while (days > 0) {
                currentDate.add(1,'day');
                if (isoWeekdays.includes(currentDate.isoWeekday())) days--;
            }
        } else {
            while (days < 0) {
                currentDate.subtract(1,'day');
                if (isoWeekdays.includes(currentDate.isoWeekday())) days++;
            }
        }

        return currentDate;
    },

    getDecimal(num) {
        let str = "" + num;
        const zeroPos = str.indexOf(".");
        if (zeroPos === -1) return 0;
        str = str.slice(zeroPos);
        return +str;
    },

    captureErrorMessage(title, errorData) {
        if (typeof Raven !== "undefined") {
            Raven.captureMessage(title, errorData);
        } else {
            console.error(title, errorData);
        }
    },

    helpUrl(articleKey) {
        return 'https://www.goodday.work/help/kb/'+gd.const.help.articles[articleKey];
    },

    youtubeUrl(videoKey) {
        return 'https://www.youtube.com/watch?v='+gd.const.video[videoKey];
    },

    convertNameToId(value) {
        return value ? value.trim().toLowerCase().split(' ').join('_') : null;
    }
};


Object.defineProperty(GDUtils, 'TYPE_MINUTES', {
    value: 'minutes',
    writable: false,
    enumerable: true,
    configurable: true
});

Object.defineProperty(GDUtils, 'TYPE_HOURS', {
    value: 'hours',
    writable: false,
    enumerable: true,
    configurable: true
});

Object.defineProperty(GDUtils, 'TYPE_SECONDS', {
    value: 'seconds',
    writable: false,
    enumerable: true,
    configurable: true
});

module.exports = GDUtils;