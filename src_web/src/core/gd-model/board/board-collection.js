const AmpersandCollection = require('ampersand-collection');
const BoardModel = require('./board-model');

const BoardCollection = AmpersandCollection.extend({
    model: BoardModel,

    initialize: function (models) {},

    filterByCompany(companyId) {
        return new BoardCollection(this.filter(function(m){
            return (m.companyId==companyId);
        }),{parse:false});
    },

});

module.exports = BoardCollection;