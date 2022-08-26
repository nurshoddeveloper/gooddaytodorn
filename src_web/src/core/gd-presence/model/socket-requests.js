var AmpersandCollection = require('ampersand-collection');
var RequestModel = require('./socket-request');

var debug = {
    error: true,
    monitor: false
};

var RequestsCollection = AmpersandCollection.extend({
    model: RequestModel,

    initialize: function (models) {
        if (debug.monitor) this.monitor();
    },

    monitor: function() {
        //console.groupCollapsed("@Presence pending requests "+this.length);
        //console.log("@")
        //console.groupEnd();

        setTimeout(this.monitor.bind(this),15*1000);

    }
});

module.exports = RequestsCollection;