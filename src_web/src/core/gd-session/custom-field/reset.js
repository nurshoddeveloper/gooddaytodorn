const EventCustomFieldsReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventCustomFieldsReset.prototype.validate = function(){
    return true;
};

EventCustomFieldsReset.prototype.process = function(){
    gd.session.customFields.reset(this.data,{parse:true});
};


module.exports = EventCustomFieldsReset;
