const AmpersandModel = require('ampersand-model');

const PinModel = AmpersandModel.extend({
    idAttribute: 'id',

    props: {
        id: 'string',
        project: 'object',
        task: 'object',
        user: 'object'
    },

    getType() {
        let result;

        if (this.task)          result = "task";
        else if (this.project)  result = "project";
        else if (this.user)     result = "user";

        return result;
    },

    goTo() {
        let result;

        if (this.task)          result = gd.taskView.open(this.task.id, null);
        else if (this.project)  result = gd.goTo('p/'+this.project.id);
        else if (this.user)     result = gd.goTo('u/'+this.user.companyId+'-'+this.user.userId+'/dashboard');

        return result;
    }
});

module.exports = PinModel;