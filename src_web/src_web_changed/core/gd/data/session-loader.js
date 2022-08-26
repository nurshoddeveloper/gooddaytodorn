import { Deferred } from 'simply-deferred';
const _ = require('lodash');
const ApiCall = require('./api-call');

const debug = {
    dev: true
};

const SessionLoader = function () {
    const deferredLoader = new Deferred();

    deferredLoader.process = function(dataToLoad) {
        try {
            deferredLoader._doProcess(dataToLoad)
        } catch (e) {
            // one more catch for inner errors, might be not catched by upper objects
            deferredLoader.reject(e);

            window.sentryLogger.captureMessageError('SessionLoader deferredLoader.process() exception', e);
            window.sentryLogger.captureException(e);
        }
    };

    deferredLoader._doProcess = function(dataToLoad) {

        if (!dataToLoad) {
            deferredLoader.resolve();
        } else {
            if (debug.dev) {
                console.log("@Session lazy loading...", _.size(dataToLoad));
                console.log(dataToLoad);
                //console.groupEnd();
            }

            const findMissingData = (data)=>{
                const { taskTypes, projects } = data;
                if (!taskTypes && !projects) return false;

                let allCustomFields = [];
                taskTypes && taskTypes.map(ttId=>{
                    const taskType = gd.session.taskTypes.get(ttId);
                    if (taskType) allCustomFields = _.union(allCustomFields, taskType.customFields);
                });

                projects && projects.map(pId=>{
                    const project = gd.session.projects.get(pId);
                    if (project) allCustomFields = _.union(allCustomFields, project.customFields);
                });

                return gd.session.findMissing({
                    customFields: allCustomFields
                });
            };

            const sessionDataLoader = new ApiCall(this, 'POST', 'session', dataToLoad);

            sessionDataLoader.done((response) => {
                debug.dev && console.log('sessionDataLoader done', response);
                //load custom fields data for just loaded taskTypes
                const cfDataToLoad = findMissingData(dataToLoad);
                if (cfDataToLoad) {
                    const cfLoader = new ApiCall(this, 'POST','session', cfDataToLoad);
                    cfLoader.done(response => { deferredLoader.resolve(); });
                    cfLoader.fail(error => {
                        /*gd.apiError(error);*/
                        debug.dev && console.log('sessionDataLoader cfLoader fail', error);
                        deferredLoader.reject(error);
                        window.sentryLogger.captureException(error);
                    });
                } else {
                    deferredLoader.resolve();
                }
            });

            sessionDataLoader.fail(error => {
                /*gd.apiError(error);*/
                debug.dev && console.log('sessionDataLoader fail', error);
                deferredLoader.reject(error);
                window.sentryLogger.captureException(error);
            });
        }
    };

    return deferredLoader;
};

module.exports = SessionLoader;