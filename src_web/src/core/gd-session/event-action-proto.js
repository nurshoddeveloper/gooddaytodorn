var debug = {
    dev: false,
    head: '&& EventActionPrototype'
};

class EventActionProto {

    constructor(uid, data, restartApps=[]) {
        this.uid = uid;
        this.data = data;
        this.restartApps = restartApps;
    }

    validate() {
        return true;
    }

    process() {

        if (gdConfig.nativeApp) return;

        if (debug.dev) console.log(debug.head, "POTENTIAL Restart apps:",this.restartApps,this.restartApps.length);

        if (this.restartApps && this.restartApps.length>0) {
            this.restartApps.map(function(appName){
                if (gd.app && gd.app.name==appName) {
                    if (debug.dev) console.log(debug.head,"restarting...",appName);
                    gd.app.start();
                }
            })
        }
    }

}

module.exports = EventActionProto;