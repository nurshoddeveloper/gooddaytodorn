const AmpersandCollection = require('ampersand-collection');
const RecentOrganizationModel = require('./recent-organization');
import localStorage from '../../../../src_web_changed/local-storage';

const debug = {
    dev: false,
    head: '[Recent.Organizations]'
};

module.exports = AmpersandCollection.extend({
    model: RecentOrganizationModel,

    comparator: function(m) {
        return -m.counter;
    },

    initialize() {
        // we run init on collection creation !
        this.init();
    },

    reInit() {
        if (this.length<1) this.init();
    },

    init: function () {

        if (debug.dev) console.log(debug.head,"init");

        //const lsProjects = localStorage.getItem('recent.organizations');

      localStorage.getItem('recent.organizations').then(lsProjects => {



        if (lsProjects !== null) {
            const arr = lsProjects.split(",");
            arr.map(function(value){

                const parts = value.split("-");

                this.add({
                    organizationId: parts[0],
                    counter: parseInt(parts[1])
                },{
                    silent: true
                });

            }.bind(this));

            if (debug.dev) {
                console.log(debug.head,"(initFrom:LocalStorage)");
                this.debug();
            }

        } else {
            if (debug.dev) console.log(debug.head,"ls data not found - need to reinit from session list");


            if ((typeof gd !== 'undefined' && gd !== null) && gd.session && gd.session.companies) {
                gd.session.companies.map(function(m){
                    this.add({
                        organizationId: m.id
                    },{
                        silent: true
                    });
                }.bind(this));

                if (debug.dev) {
                    console.log(debug.head,"(init from session done)");
                }

                this.save();
            }

        }

      });
    },

    toString: function() {
        let organizations = this.map(function(r){
            return r.localStorageFormat();
        });
        organizations = organizations.join(",");

        if (debug.dev) console.log(debug.head,"(toString)",organizations);
        return organizations;
    },

    save: function() {
        localStorage.setItem('recent.organizations', this.toString());
    },

    increaseCounter: function(organizationId) {
        if (debug.dev) console.log(debug.head,".increaseCounter()",organizationId);

        //find project if found - update it's time open to now ?
        let organization = this.get(organizationId);

        if (organization) {
            organization.counter = organization.counter + 1;
        } else {
            this.add({
                organizationId: organizationId,
                counter: 1
            });
        }

        this.sort();
        this.save();

        if (debug.dev) {
            console.log(debug.head,".increaseCounter() DONE");
            this.debug();
        }
    },

    getCounter(organizationId) {
        if (this.get(organizationId)) return this.get(organizationId).counter;
        else return 0;
    },

    getSorted(){
        this.sort();
        return this;
    },

    debug: function() {
        this.map(function(m){
            console.log(m.organizationId,m.counter);
        });
    }


});