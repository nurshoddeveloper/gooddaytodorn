var EventFavoritesReset = function(uid,data) {
    this.data = data;
    this.uid = uid;
};

EventFavoritesReset.prototype.validate = function(){
    return true;
};

EventFavoritesReset.prototype.process = function(){
    gd.session.favorites.reset(this.data);
};

module.exports = EventFavoritesReset;
