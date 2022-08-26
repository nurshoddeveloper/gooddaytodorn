var SessionEvent = function(event) {

    this.uid = event.uid;
    this.method = event.method;
    this.object = event.object;
    this.data = event.data;

};


SessionEvent.prototype.validate = function(){}




module.exports = SessionEvent;