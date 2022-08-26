const AmpersandState = require('ampersand-state');

const debug = {
    error: true,
    dev: false
};

const Request = AmpersandState.extend({
    idAttribute: 'id',
    props: {
        id: 'string',
        command: 'string',
        args: 'any',
        status: {
            type: 'string',
            values: ['new', 'pending', 'done']
        },
        reply: 'any',
        onError: 'any',
        onSuccess: 'any'
    },

    initialize: function() {
        this.id = gd.utils.guid();
        this.status = 'new';
    },

    setResponse: function(data) {

        this.status = "done";
        this.reply = data;

        this.onSuccess.apply(null,[data]);

        this.collection.remove(this);
    },

    toObject: function() {
        return {
            'command': this.command,
            'requestId': this.id,
            'args': this.args
        }
    }
});

module.exports = Request;