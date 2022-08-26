const Request = require('./model/socket-request');
const AmpersandSate = require('ampersand-state');

const debug = {

    error: true,
    dev: true,
    monitor: true,
    head: "@Presence"
};

// 0 - disconnected
// 1 - connecting
// 2 - connected

const Presence = AmpersandSate.extend({

    socket: undefined,

    props: {
        status: {
            type: 'number',
            default: 1
        }
    },

    queue: [],

    maxReconnectAttempts: 100,
    reconnectDelay: 3*1000, //seconds
    reconnectAttempts: 0,
    reconnectTimeout: null,
    isFirstConnect: true, // true if no connection has been established yet - next onConnect is first

    // https://github.com/ocetnik/react-native-background-timer
    pingTimer: null,
    pingDelay: 1*60*1000, // 4.5

    init: function() {
        if (debug.dev) console.log("@Presence.init()");
        this.socket = require('./socket-manager');
        this.stopFlag = false;
        this.socket.init(this);
    },

    stop: function() {
      if (debug.dev) console.log("@Presence.stop()");
      this.stopFlag = true;
      if (this.socket) this.socket.close();
      clearTimeout(this.reconnectTimeout);
      clearInterval(this.pingTimer);
      this.isFirstConnect = true;
      this.reconnectAttempts = 0;
      this.status = gd.const.presence.DISCONNECTED;
      this.queue=[];
    },

    addToRequestQueue: function(request) {

        if (request.command == 'navigate') {
            var found = false;
            this.queue.forEach(function(request,key){
                if (request.command == 'navigate') {
                    found = key;
                }
            }.bind(this));

            if (found===false) this.queue.push(request);
            else this.queue[found] = request;

        } else {
            this.queue.push(request);
        }

    },

    onConnect: function() {

        this.status = gd.const.presence.CONNECTED;
        this.reconnectAttempts = 0;

        if (debug.dev) console.log("@Presence.onConnect - queue",this.queue);

        if (debug.monitor) console.log("@Presence connected");

        if (this.queue.length>0) {
            if (debug.monitor) console.log("@Presence dispatch Queue");
            this.queue.map(function(request){
                this.sendRequest(request);
            }.bind(this));
            this.queue=[];
        }

        // dont' reset if it's the very first connection
        if (!this.isFirstConnect) gd.session.resetAll();

        // allow reset all fo future onConnect
        this.isFirstConnect = false;

        //set ping timer
        this.pingTimer = setInterval(this.ping.bind(this),this.pingDelay);


    },
    onDisconnect: function() {

        if (this.stopFlag) return;

        this.status = gd.const.presence.CONNECTING;

        if (this.reconnectAttempts==0) {
            this.reconnect();
        } else {
            this.reconnectTimeout = setTimeout(this.reconnect.bind(this),this.reconnectDelay);
        }

        // cancel ping timer
        clearInterval(this.pingTimer);

        if (debug.monitor) console.warn("@Presence disconnect");
    },
    reconnect: function() {

        this.reconnectAttempts++;

        if (this.reconnectAttempts<=this.maxReconnectAttempts) {
            if (debug.monitor) console.log("@Presence reconnect. Attempt=",this.reconnectAttempts);
            this.socket.init(this);
        } else {
            this.status = gd.const.presence.DISCONNECTED;
            window.sentryLogger.captureMessageInfo('Presense max reconnectAttempts reached');
        }
    },

    reconnectManual: function() {

        this.reconnectAttempts = 0;
        this.reconnect();

    },

    sendRequest: function(request) {

        if (debug.monitor) console.log(debug.head,'.sendRequest ',request);

        if (this.status==gd.const.presence.CONNECTED) {
            this.socket.sendRequest(request);
        } else {
            if (debug.monitor) console.log("@Presence - can't send request - NOT CONNECTED, adding to dispatcher");

            this.addToRequestQueue(request);

            if (debug.dev) console.log("@Presence - queue",this.queue);

        }

    },

    navigate: function(appName,id) {

        if (!id) id = null;

        var request = new Request({
            command: 'navigate',
            args: [appName,id],
            onSuccess: function(data) {
                if (debug.dev) console.log("@Presence navigate OK");
            }
        });

        this.sendRequest(request);
    },

    ping: function() {
        var request = new Request({
            command: 'ping',
            args: [],
            onSuccess: function(data) {
                if (debug.dev) console.log(debug.head," ping reply", data);
                if (data!="pong") {
                    try {
                      clearInterval(this.pingTimer);
                      this.status = gd.const.presence.DISCONNECTED;
                      this.socket.close();
                    } catch(e) {
                      console.log('ping response error', e);
                      window.sentryLogger.captureException(e);
                    }
                }
            }.bind(this)
        });

        this.sendRequest(request);
    }

});

module.exports = Presence;