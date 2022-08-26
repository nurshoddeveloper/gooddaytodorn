var Attachment = require('./attachment-basic');

module.exports = Attachment.extend({
    props: {
        taskMessageId: 'string'
    },
    parse: function(obj){
        return obj;
    }
});
