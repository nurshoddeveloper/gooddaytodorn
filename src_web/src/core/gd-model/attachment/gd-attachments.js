var AmpersandCollection = require('ampersand-collection');
var GDAttachmnet = require('./gd-attachment');
var _ = require('lodash');


var GDAttachments = AmpersandCollection.extend({
    model: GDAttachmnet,

    initialize: function (models) {
    },

    findFilesFilterValues: function () {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return {};

        var result = {
            all: {
                counter: 0,
                item: 'All'
            },
            pin: {
                counter: 0,
                item: 'Pin'
            }
        };

        this.models.forEach(function (m) {
            if (m.isFlagged) {
                result.pin.counter++;
            }

            result.all.counter++;
        });

        var arrRes = _.sortBy(result, 'counter');
        return arrRes.reverse();
    },

    findUserFilterValues: function () {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return {};

        var result = {};

        this.models.forEach(function (m) {

            if (!m.user) {
                return;
            }

            if (!result[m.user.name]) {
                result[m.user.name] = {
                    counter: 0
                };

                result[m.user.name]['item'] = m.user;
            }

            result[m.user.name]['counter']++;
        });

        var arrRes = _.sortBy(result, 'counter');
        return arrRes.reverse();
    },

    findFileSizeFilterValues: function () {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return {};

        var result = {
            r1:{
                counter:0,
                range: {
                    min: 0,
                    max: 10
                },
                item: "0 to 10 mb"
            },
            r2:{
                counter:0,
                range: {
                    min: 10,
                    max: 50
                },
                item: "10 to 50 mb"
            },
            r3:{
                counter:0,
                range: {
                    min: 50,
                    max: 100
                },
                item: "50 to 100 mb"
            },
            r4:{
                counter:0,
                range: {
                    min: 100,
                    max: -1
                },
                item: "more than 100 mb"
            }
        };

        this.models.forEach(function (m) {

            if (!m.size) {
                return;
            }

            for(var prop in result) {
                if (result.hasOwnProperty(prop)){
                    var resultItem = result[prop];
                    var range = resultItem.range;
                    if(m.size > range.min && (range.max == -1 || m.size < range.max)){
                        resultItem['counter']++;
                        break;
                    }
                }
            }
        });

        var arrRes = _.sortBy(result, 'item');
        return arrRes;
    },

    findFileTypeFilterValues: function () {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return {};

        var result = {};

        this.models.forEach(function (m) {

            if (!m.fileType) {
                return;
            }

            if (!result[m.fileType]) {
                result[m.fileType] = {
                    counter: 0
                };

                result[m.fileType]['item'] = m.fileType;
            }

            result[m.fileType]['counter']++;
        });

        var arrRes = _.sortBy(result, 'counter');
        return arrRes.reverse();
    },

    findTaskFilterValues: function () {
        if (!this.models || !this.models[0] || !this.models[0]['id']) return {};

        var result = {};

        this.models.forEach(function (m) {

            if (!m.task) {
                return;
            }

            if (!result[m.task.id]) {
                result[m.task.id] = {
                    counter: 0
                };

                result[m.task.id]['item'] = {
                    id: m.task.id,
                    name: m.task.title,
                    iconSmall: null
                };
            }

            result[m.task.id]['counter']++;
        });

        var arrRes = _.sortBy(result, 'counter');
        return arrRes.reverse();
    }

});

module.exports = GDAttachments;