const AmpersandCollection = require('ampersand-collection');
const TileModel = require('./tile-model');

//const Moment = require('moment');

const TilesCollection = AmpersandCollection.extend({

    model: TileModel,

    comparator(m1,m2) {
        if (!m2) return 0;
        if (m1.sortPosition>m2.sortPosition) return 1;
        if (m1.sortPosition<m2.sortPosition) return -1;
        else return 0;
    },

    moveItemToPosition(itemId, position) {
        let index = 0;
        this.models.map(function(item, key){

            if (item.id === itemId){
                item.set({
                    sortPosition: position
                }, {silent: true});
            } else {

                if (index === position) index++;

                item.set({
                    sortPosition: index
                }, {silent: true});

                index++;
            }
        });

        this.sort();
    }

});

module.exports = TilesCollection;