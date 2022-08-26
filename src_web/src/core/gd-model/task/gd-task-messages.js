const AmpersandCollection = require('ampersand-collection');
const GDTaskMessage = require('./gd-task-message');

const GDTaskMessagess = AmpersandCollection.extend({
    model: GDTaskMessage,

    initialize(models) { },

    filterByLevel(level) {
        switch (level) {
            case 1: return this.filter(m=>[1,2,3].includes(m.type));
            case 2: return this.filter(m=>[1,2,3,11,12,13,14,15,16,18,19].includes(m.type));
            case 3: return this.filter(m=>[1,2,3,10,17,11,12,13,14,15,16,19,20,21].includes(m.type));
            case 4: return this.models;
        }
    }
});

module.exports = GDTaskMessagess;