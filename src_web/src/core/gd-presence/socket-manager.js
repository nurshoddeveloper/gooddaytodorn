const RequestsCollection = require('./model/socket-requests');
const RequestModel = require('./model/socket-request');
import { Platform } from 'react-native';
import appInfo from '../../../../package.json';

const debug = {
    error: true,
    dev: false,
    monitor: false
};
const appMarker = 'app_' + Platform.OS + '_' + appInfo.version;


const WebSocketManager = {

    ws: undefined,
    presence: undefined,

    requests: new RequestsCollection(),

    init: function(presence) {

        if (debug.monitor) console.log("@Socket.init()");

        this.presence = presence;


        const isSecured = (gdConfig.nativeApp || location.protocol == 'https:');
        let wsUri = (isSecured)?'wss://':'ws://';
        wsUri = wsUri + gdConfig.presenceUrl;
        if (debug.monitor) console.log("ws url = ",wsUri);

        if (this.ws) {
            debug.dev && console.warn('@Socket.init() websocket already exists');
            this.close();
        }

        try {
            this.ws = new WebSocket(wsUri);

            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onerror = this.onError.bind(this);

        } catch (e) {
            if (debug.error) console.warn("@Socket can't open web socket");
            window.sentryLogger.captureException(e);
        }
    },

    // Native socket methods

    onError: function(e) {
        if (debug.error) console.log('@Socket onError', Object.getOwnPropertyNames(e));
    },

    onOpen: function() {
        if (debug.monitor) console.log("@Socket - socket is open");
        this.connect();
    },

    onMessage: function (evt) {
        try {
            const msg = JSON.parse(evt.data);

            if (debug.dev) console.log("@Socket <-- ",msg);

            if (msg.requestId) {
                this.onRequestResponse(msg);
            }

            if (msg.session) {
                gd.session.processEvents(msg.session);
            }

        } catch (e) {
            console.warn('something wrong with incomming message processing', e, evt.data);
        }
    },

    onClose: function (event) {
        if (debug.monitor) console.log("@Socket - closed", Object.getOwnPropertyNames(event));
        this.presence.onDisconnect();
    },

    send: function(data) {

        if (debug.monitor) console.log("@Presence --> ",data);

        this.ws.send(JSON.stringify(data));
    },


    // Presence connect methods

    connect: function() {
        if (debug.monitor) console.log("@Socket --> ", 'connect', 'gd.session.me', gd.session.me ? gd.session.me._values : undefined, appMarker);
        if (gd.session.me) {

            const userId = gd.session.me.id;
            // https://www.goodday.work/t/I5WU5H
            if (!userId) window.sentryLogger.captureMessageWarning('WebSocketManager.connect() empty userId');

            var request = new RequestModel({
                command: 'connect',
                args: [userId, appMarker],
                onSuccess: this.onConnect.bind(this)
            });
            //request.onSuccess = this.onConnect.bind(this);

            this.sendRequest(request);

        } else {
            if (debug.error) console.error("@Presence.connect (ME) is undefined");
        }

    },

    close() {
        if (!this.ws) return;

        this.ws.onopen = () => {};
        this.ws.onmessage = () => {};
        this.ws.onclose = () => {};
        this.ws.onerror = () => {};

        try {
          this.ws.close();
        } catch (e) {
            // do nothing
        }

        this.ws = null;
    },

    onConnect: function(data) {
        this.presence.onConnect();
    },

    // Data objects methods

    sendRequest: function(request) {
        /*
        CONNECTING 	0 	The connection is not yet open.
        OPEN 	1 	The connection is open and ready to communicate.
        CLOSING 	2 	The connection is in the process of closing.
        CLOSED 	3 	The connection is closed or couldn't be opened.
        */

        if (this.ws.readyState  != 1) {
            window.sentryLogger.captureMessageInfo('WebSocketManager.sendRequest() websocket in state: ' + this.ws.readyState);
            return;
        }

        try {

          this.requests.add(request);

          if (debug.monitor) console.log("@Socket request: " + request.command + " --> ", request.args);

          this.ws.send(JSON.stringify(request.toObject()));
          request.status = "pending";

        } catch (e) {
            window.sentryLogger.captureException(e);
        }
    },

    onRequestResponse: function(reply) {

        var request = this.requests.get(reply.requestId);

        if (debug.monitor) console.log("@Socket request:\""+request.command+"\" <-- ",reply.data);

        request.setResponse(reply.data);
    }


};

module.exports = WebSocketManager;