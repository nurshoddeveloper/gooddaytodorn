const AmpersandCollection = require('ampersand-collection');
const Pin = require('./pin');

const PinsCollection = AmpersandCollection.extend({
    model: Pin,

    getPinId(data) {
        const { projectId, taskId, userId } = data;
        let result = false;

        if (taskId)         result = this.isTaskInPins(taskId);
        else if (projectId) result = this.isProjectInPins(projectId);
        else if (userId)    result = this.isUserInPins(userId);

        return result;
    },

    isTaskInPins(id) {
        let pinId = null;
        this.models.forEach(pin=>{
            const { task } = pin;
            if (task && task.id === id) pinId = pin.id;
        });
        return pinId;
    },

    isProjectInPins(id) {
        let pinId = null;
        this.models.forEach(pin=>{
            const { project } = pin;
            if (project && project.id === id) pinId = pin.id;
        });
        return pinId;
    },

    isUserInPins(id) {
        let pinId = null;
        this.models.forEach(pin=>{
            const { user } = pin;
            if (user && user.userId === id) pinId = pin.id;
        });
        return pinId;
    },

    removePinById(id) {
        const pin = this.get(id);
        if (pin) this.remove(pin);
    },
});

module.exports = PinsCollection;