var AmpersandCollection = require('ampersand-collection');
var DotsModel = require('./dots-item');

var DotsCollection = AmpersandCollection.extend({
    model: DotsModel,

    initialize: function (models) {
    },

    exportToDaysBar() {

        var res = {};

        this.map(function (model) {
            var date = model.moment.format("YYYY-MM-DD");

            if (!res[date]) res[date] = {
                commented: model.commented,
                completed: model.completed,
                users: []
            };
        });

        return res;
    },

});

module.exports = DotsCollection;