const _ = require('lodash');
const AmpersandCollection = require('ampersand-collection');
const TaskStandardModel = require('./task-standard');

const TasksStandardCollection = AmpersandCollection.extend({

    model: TaskStandardModel,


    sortByType() {

        this.models = _.sortBy(this.models,function(m){
            return m.taskType.id;
        });

    }

});

module.exports = TasksStandardCollection;