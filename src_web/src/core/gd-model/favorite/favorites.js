var AmpersandCollection = require('ampersand-collection');
var GDFavorite = require('./favorite');


var GDFavorites = AmpersandCollection.extend({
    model: GDFavorite,

    initialize: function (models) {
    },

    exportMenu: function () {
        var menu = this.map(function (favorite) {
            return favorite.exportMenu()
        });

        //menu.push({
        //    id: 'all-projects',
        //    name: "All projects",
        //    icon: '',
        //    type: 3,
        //    url: 'projects'
        //});
        return menu;
    },
    isUrlInFavorites: function(url) {
        var found = false;
        this.models.forEach(function(favorite){
            if (favorite.url==url) found = true;
        });
        return found;
    },
    findOneByUrl: function(url){
        var result = null;
        this.each(function(favorite){
            if (favorite.url==url) result=favorite;
        });
        return result;
    }
});

module.exports = GDFavorites;