var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
    idAttribute: "id",

    props: {
        priority1: 'string',
        priority2: 'string',
        priority3: 'string',
        priority4: 'string',
        priority5: 'string',
        priority6: 'string',
        priority7: 'string',
        priority8: 'string',
        priority9: 'string',
        priority10: 'string',
        priority50: 'string',
        priority100: 'string'
    },

    exportToOptions() {

        var res = [];

        if (this.priority100) res.push({ value: 100, label: this.priority100 });
        if (this.priority50) res.push({ value: 50, label: this.priority50 });
        if (this.priority10) res.push({ value: 10, label: this.priority10 });
        if (this.priority9) res.push({ value: 9, label: this.priority9 });
        if (this.priority8) res.push({ value: 8, label: this.priority8 });
        if (this.priority7) res.push({ value: 7, label: this.priority7 });
        if (this.priority6) res.push({ value: 6, label: this.priority6 });
        if (this.priority5) res.push({ value: 5, label: this.priority5 });
        if (this.priority4) res.push({ value: 4, label: this.priority4 });
        if (this.priority3) res.push({ value: 3, label: this.priority3 });
        if (this.priority2) res.push({ value: 2, label: this.priority2 });
        if (this.priority1) res.push({ value: 1, label: this.priority1 });

        return res;
    },

    getName(priority,showNumberIfNoValue) {
        if (this['priority'+priority]) return this['priority'+priority];
        else {
            if (showNumberIfNoValue===true)
                return priority;
            else return "";
        }
    },

    setName(priority,name) {
        this['priority'+priority] = name;
    }

});