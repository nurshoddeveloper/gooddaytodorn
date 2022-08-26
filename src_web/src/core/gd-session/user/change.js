var EventUserChange = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventUserChange.prototype.validate = function(){
    return true;
};

EventUserChange.prototype.process = function(){

    var updatedUser = this.data;

    //if me
    if (updatedUser.id == gd.session.me.id) {

        gd.session.me.set({
            name: updatedUser.name,
            icon: updatedUser.icon
        })

    } else {


        var user = gd.session.users.get(updatedUser.id);

        user.set({
            name: updatedUser.name,
            icon: updatedUser.icon
        });

    }


};


module.exports = EventUserChange;