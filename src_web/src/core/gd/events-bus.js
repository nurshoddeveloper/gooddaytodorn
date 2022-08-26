const AmpersandEvents = require('ampersand-events');
import _ from 'lodash';

const debug = {
    monitor: false,
    trigger: false,
    subscribe: false,
    head: "@EventsBus"
};

class EventsBus {

    constructor() {
        this.emmiter = AmpersandEvents.createEmitter();
        this.debouncedEvents = {};
    }

    triggerEvent(eventName,...params) {
        if (debug.monitor || debug.trigger) console.log(debug.head,".trigger event=",eventName,"params=",...params);
        this.emmiter.trigger(eventName,...params);
    }

    triggerEventDebounced(eventName,params) {
        if (!this.debouncedEvents[eventName]) this.debouncedEvents[eventName] = _.debounce(this.triggerEvent.bind(this), 10);
        this.debouncedEvents[eventName](eventName,params)
    }

    subscribe(eventName,context,callback) {
        if (debug.monitor || debug.subscribe) console.log(debug.head,".subscribe on event=",eventName);
        this.emmiter.on(eventName, callback, context);
    }

    unsubscribe(context) {
        if (debug.monitor) console.log(debug.head,".off",context);
        this.emmiter.off(null,null,context);
    }

}


module.exports = EventsBus;