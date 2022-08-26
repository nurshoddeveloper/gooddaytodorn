//var UpdatesCollection = require('../../gd-model/update/updates');

var EventUpdatesReset = function(uid,data) {

    this.data = data;
    this.uid = uid;

    this.validate = function(){
        return true;
    };

    this.process = function(){
        //gd.session.updates.reset(this.data,{parse:true});
        let val = 0;
        if (this.data) {
            val = this.data.length;
        }

        gd.session.counters.setNotificationsCount(val);

    };

};


module.exports = EventUpdatesReset;
