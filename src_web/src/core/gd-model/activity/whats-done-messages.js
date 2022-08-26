var _ = require('lodash');
var AmpersandCollection = require('ampersand-collection');
var TaskMessage = require('./whats-done-message');
var TaskUserCollection = require('./../task/gd-task-user');

var TaskMessagess = AmpersandCollection.extend({

    model: TaskMessage,

    initialize: function (models) {
    },

    filterByDateRange(dateRange) {
        return new TaskMessagess(this.filter(m => m.dateCreated.within(dateRange), {parse: false}));
    },

    groupByTask() {

        var res = {};

        this.map(function (msg) {
            var taskId = msg.task.id;
            if (!res[taskId]) res[taskId] = [];
            res[taskId].push(msg);
        });

        return res;
    },

    groupByDateAndTask() {

        var res = {};

        this.map(function (msg) {
            var date = msg.dateCreated.format("YYYY-MM-DD");
            var taskId = msg.task.id;

            if (!res[date]) res[date] = {};

            if (!res[date][taskId]) res[date][taskId] = [];

            res[date][taskId].push(msg);

            //console.log(".",msg);
        });

        return res;
    },

    groupByTaskAndDate() {

        var res = {};

        this.map(function (msg) {
            var date = msg.dateCreated.format("YYYY-MM-DD");
            var taskId = msg.task.id;

            if (!res[taskId]) res[taskId] = {};

            if (!res[taskId][date]) res[taskId][date] = [];

            res[taskId][date].push(msg);
        });

        return res;
    },


    exportToDaysBar() {

        var res = {};

        this.map(function (msg) {
            var date = msg.dateCreated.format("YYYY-MM-DD");
            var taskId = msg.task.id;

            if (!res[date]) res[date] = {
                completedTasks: {},
                commentedTasks: {},
                users: {}
            };

            switch (msg.communicationFlow) {
                case 1:
                case 3:
                case 4:
                case 5:

                    if (!res[date].completedTasks[taskId]) res[date].completedTasks[taskId] = true;

                    break;
                case 2:
                    if (!res[date].commentedTasks[taskId]) res[date].commentedTasks[taskId] = true;
                    break;
            }

            var user = msg.user;
            if (user && !res[date].users.hasOwnProperty(user.id)){
                res[date].users[user.id] = user
            }
        });

        //remove commented if there is completed (!)
        _.forEach(res, function (dateObj, date) {
            _.forEach(dateObj.completedTasks, function (val, taskId) {
                if (dateObj.commentedTasks[taskId]) {
                    delete dateObj.commentedTasks[taskId];
                }
            });
        });


        // format to right format
        var finalRes = {};
        _.forEach(res, function (dateObj, date) {

            if (!finalRes[date]) finalRes[date] = {
                completed: 0,
                commented: 0,
                users: []
            };

            _.forEach(dateObj.completedTasks, function (val, taskId) {
                finalRes[date].completed = finalRes[date].completed + 1;
            });

            _.forEach(dateObj.commentedTasks, function (val, taskId) {
                finalRes[date].commented = finalRes[date].commented + 1;
            });

            var users = [];
            for(var userId in dateObj.users){
                if (dateObj.users.hasOwnProperty(userId))
                    users.push(dateObj.users[userId]);
            }
            finalRes[date].users = users;
        });

        return finalRes;
    },

    exportToSummary() {

        var grouped = this.groupByTask();

        var tasksTotal = 0;

        _.forEach(grouped, function (arrMessages, taskId) {
            tasksTotal++;
        });

        return {
            hoursReport: 4.67,
            tasks: tasksTotal,
            tasksDone: 2
        }
    },

    exportToTree() {

        var tasks = this.groupByTaskAndDate();

        var children = [];

        _.forEach(tasks, function (task, taskId) {

            var taskInfo = null, size = 0;

            _.forEach(task, function (arrMsg, date) {
                if (!taskInfo) taskInfo = arrMsg[0];
                //size = size + 100;
                size = gd.utils.randomInt(3000, 100);
            });

            children.push({
                name: taskInfo.task.title,
                task: taskInfo.task,
                project: taskInfo.task.project,
                taskType: taskInfo.task.taskType,
                estimatedTime: taskInfo.estimatedTime,
                reportedTime: taskInfo.reportedTime,
                communicationFlow: taskInfo.communicationFlow,
                dateCreated: taskInfo.dateCreated,
                message: taskInfo.message,
                size: size
            });

        });

        var valuesMap = [];
        children.map(item => {
            if (valuesMap.indexOf(item.size) === -1) {
                valuesMap.push(item.size);
            }
        });
        valuesMap.sort((a, b) => a - b);

        //*** BEGIN COLORS - OPACITY ***//

        var maxSize = valuesMap[valuesMap.length-1];
        var minSize = valuesMap[0];

        //console.log("max=",maxSize,"minSize",minSize);

        var maxOpacity = 1;
        var minOpactiy = 0.75;
        var opacityRange = maxOpacity - minOpactiy;

        // so max = 100% now calculate each task size in % taking max as 100%
        children.map(item => {
            var s = item.size;
            var curTaskPercentage = Math.ceil(s/(maxSize/100));


            // ok now let's covert % into opacity range ... so 1% size = opacity range/100
            var opacity = minOpactiy + curTaskPercentage * (opacityRange/100);

            // round to 2 decimals
            opacity = Math.round(opacity * 100) / 100;

            //console.log("size",s," is ",curTaskPercentage,"%"," opacity=",opacity);
            item.opacity = opacity;
        });

        //*** END COLORS - OPACITY ***//


        var calibrateLength = children.length > 5 ? 5 : children.length;
        var interval = Math.max.apply(null, valuesMap) / calibrateLength;
        var calibratedChildren = children.map(item => {
            var calibratedItem = _.assign({},item);
            for (var i = 0; i < calibrateLength; i++) {
                if (item.size <= interval * (i + 1)) {
                    calibratedItem.size = i * 100 + 100;
                    return calibratedItem;
                }
            }
            return calibratedItem;
        });

        var calibratedValuesMap = [];
        calibratedChildren.map(item => {
            if (calibratedValuesMap.indexOf(item.size) === -1) {
                calibratedValuesMap.push(item.size);
            }
        });
        calibratedValuesMap.sort((a, b) => a - b);

        return {
            parent: true,
            children: calibratedChildren
        };


    }


});

module.exports = TaskMessagess;