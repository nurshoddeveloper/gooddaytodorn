const LocalSettings = require('../../../core/gd/settings/local-settings');
const UserModel = require('../user/gd-user-basic');
import UserClientData from '../../client-data/user';
const Moment = require('moment');
//import localStorage from '../../../../src_web_changed/local-storage';

const GDMe = UserModel.extend({
    idAttribute: 'id',

    localSettings: null,

    props: {
        timezone: 'string',
        email: 'string',
        phone: 'string',

        lastVisitMyWork: 'object',
        lastVisitNotifications: 'object',
        formatSettings: 'object',
        clientData: { type: 'object', default: () => UserClientData.normalize({})},
    },

    isCompanyManager(companyId) {
        const company = gd.session.companies.get(companyId);
        return (company && company.role>=gd.const.companyRole.MANAGER);
    },

    isCompanyGuest(companyId) {
        const company = gd.session.companies.get(companyId);
        return (company && company.role<=gd.const.companyRole.GUEST);
    },

    registerVisitMyWork() {
        this.lastVisitMyWork = Moment();
        this.localSettings.set('last_visit_my_work',this.lastVisitMyWork.toJSON());
    },
    registerVisitNotifications() {
        this.lastVisitNotifications = Moment();
        this.localSettings.set('last_visit_notifications',this.lastVisitNotifications.toJSON());
    },

    initialize() {
        const now = Moment().toJSON();
        this.localSettings = new LocalSettings("gd.me",{
            last_visit_my_work: now,
            last_visit_notifications: now
        });

        this.lastVisitMyWork = Moment(this.localSettings.get('last_visit_my_work'));
        this.lastVisitNotifications = Moment(this.localSettings.get('last_visit_notifications'));

        window.reduxActions && this.on('add change remove reset', this.reduxChange);
    },

    reduxChange(values, options) {
        //console.log('me. reduxChange', values, Object.getOwnPropertyNames(values), values.toJSON());
        if (options && options.unset) {
          window.reduxActions.meReset(/*{silent:true}*/);
        } else {
          const obj = values.toJSON();
          window.reduxActions.meChange(obj);
        }
    },

    clearLocalStorage() {
        //localStorage.clear(); //andrew, local storage have critical data, sessionToken
    }
});

module.exports = GDMe;