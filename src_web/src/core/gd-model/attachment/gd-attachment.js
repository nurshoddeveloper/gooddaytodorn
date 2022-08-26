var AmpersandState = require('ampersand-state');
var AttachmentBasic = require('./attachment-basic');

var User = require('../user/gd-user-basic');
var Moment = require('moment');


console.warn("when refactor this use collections and childs ! not objects");

var Attachment = AttachmentBasic.extend({
    //idAttribute: 'id',

    props: {
        dateCreated: 'object',

        user: 'object',

        task: {
            id:'string',
            title: 'string',
            taskType: 'object'
        }
    },

    derived: {
        image: {
            deps: ['fileType', 'fileId'],
            fn: function() {
                var out = "";
                switch(this.fileType){
                    case "PNG":
                        out = "/media/attachments/"+this.fileId+".png";
                        break;
                    case "TXT":
                        out = "/media/attachments/txt_attachment.png";
                        break;
                    case "PDF":
                        out = "/media/attachments/pdf_attachment.png";
                        break;
                    case "XLS":
                        out = "/media/attachments/xls_attachment.png";
                        break;
                }
                return out;
            }
        }
    },

    parse: function(obj) {

        obj.dateCreated = Moment.utc(obj.dateCreated);
        obj.user = new User(obj.user);

        return obj;
    }
});

module.exports = Attachment;