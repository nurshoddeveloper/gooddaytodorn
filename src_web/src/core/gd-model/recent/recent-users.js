const AmpersandCollection = require('ampersand-collection');
const RecentUser = require('./recent-user');
const Moment = require('moment');
import localStorage from '../../../../src_web_changed/local-storage';

const RecentUsers = AmpersandCollection.extend({
    model: RecentUser,

    maxUsers: 10,

    comparator(m1, m2) {
        if (!m2) return 0;

        if (m1.date && m2.date){
            if (m1.date.isAfter(m2.date)) return -1;
            else if (m1.date.isBefore(m2.date)) return 1;
        } else {
            if (m1.date && !m2.date) return -1;
            else if (!m1.date && m2.date) return 1;
        }

        if (m1.reports && !m2.reports) return -1;
        else if (!m1.reports && m2.reports) return 1;

        if (m1.userName > m2.userName) return 1;
        else if (m1.userName < m2.userName) return -1;

        return 0;
    },

    init () {
        localStorage.getItem('recent.users').then(lsProjects => {
          const myId = gd.session.me.id;

          gd.session.companyUsers.map(cU => {
            this.add({
              companyId: cU.company.id,
              userId: cU.user.id,
              date: null,
              reports: cU.reportToUserId == myId
            },{parse:true, silent: true});
          });

          if (lsProjects !== null){
            const arr = lsProjects.split(",");
            arr.map(function(value){
              const parts = value.split("-");
              const user = this.get(parts[0] + "-" + parts[1]);
              if (user) user.date = Moment.utc(parts[2],"X"); //if found update date
            }.bind(this));
          }

          this.sort();
          this.save();
        });

    },

    toString() {
        const res = [];
        this.map((r, key) => {(key < this.maxUsers && r.date) ? res.push(r.localStorageFormat()) : null});
        return res.join(",");
    },

    save: function() {
        localStorage.setItem('recent.users', this.toString());
    },

    userView: function(companyId, userId) {

        //find user, if found - update it's time open to now
        const user = this.get(companyId + "-" + userId);

        if (user) {
            user.date = Moment.utc(); //if found update date
        } else {
            const cU = gd.session.companyUsers.get(companyId+"-"+userId);
            this.add({
                userId: userId,
                companyId: companyId,
                reports: cU.reportToUserId == gd.session.me.id,
                date: Moment.utc()
            },{parse:true});
        }

        this.sort();
        this.save();
    },

    getSorted(){
        this.sort();
        return this;
    },

    exportToMenu() {

        let res = [];
        this.map(ru=>{
            const cU = gd.session.companyUsers.get(ru.companyId+"-"+ru.userId);
            if (cU) {
                res.push({
                    id: "user-"+cU.id,
                    name: cU.user.name,
                    icon: cU.user.icon,
                    type: 9,
                    isOpen: false,
                    url: cU.url,
                    user: cU,
                    company: cU.company
                });
            } else {
              if (typeof(Raven) !== 'undefined') {
                Raven.captureMessage('RecentUsers exportToMenu error: no company user in session', {
                  level: 'error', // one of 'info', 'warning', or 'error'
                  extra: {
                    recentUser: ru,
                    jsonRecentUser: JSON.stringify(ru)
                  }
                });
              }
            }
        });

        const userCounter = {};

        if (res.length > this.maxUsers) res = res.slice(0, this.maxUsers); // esli delaem slice tut to pishet company toka visible a ne vsem u kogo >2 companies

        res.map(function(o){
            if (o.type==9) {
                const userId = o.user.user.id;
                if (!userCounter[userId]) userCounter[userId]=1;
                else userCounter[userId] = userCounter[userId] + 1;
            }
        });

        res.map(function(o){
            if (o.type==9) {
                const userId = o.user.user.id;
                if (userCounter[userId]<2) o.company = null;
            }
        });

        return res;

        // return res.length > this.maxUsers ? res.slice(0, this.maxUsers) : res;
    },
});

module.exports = RecentUsers;