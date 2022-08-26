const AmpersandModel = require('ampersand-model');

const GDFavorite = AmpersandModel.extend({
    props: {
        id: 'string',
        title: 'string',
        icon: 'string',
        url: 'string'
    },

    derived: {},

    exportMenu: function() {
        return {
            id: "fav-"+this.id,
            name: this.title,
            icon: this.icon,
            type: 4,
            isOpen: false,
            url: this.url.substring(0,1)=="/" ? this.url.substring(1) : this.url
        };
    }
});

module.exports = GDFavorite;