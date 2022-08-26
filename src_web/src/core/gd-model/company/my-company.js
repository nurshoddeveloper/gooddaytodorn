const CompanyBasicModel = require('./company-basic');
const PrioritiesModel = require('./company-priority');

const MyCompany = CompanyBasicModel.extend({

    props: {
        role: 'number',
        priorities: 'object',
        isAdmin: 'boolean',
        accountType: 'number',
        config: 'object',

        settings: 'object',

        finance: 'number' // current finnce module setting [0..3]
    },

    derived: {
        isPremium: {
            deps: ['accountType'],
            fn: function() {
                return !!this.accountType && this.accountType>0;
            }
        }
    },

    exportMenu: function() {
        return {
            id: this.id,
            //id: "company-"+this.id,
            name: this.name,
            icon: this.iconSmall,
            type: 7, // company menu type
            isOpen: false,
            url: this.url
        };
    },

    parse(obj) {

        obj.priorities = new PrioritiesModel();

        obj.isAdmin = (obj.isAdmin);

        return obj;
    }
});

module.exports = MyCompany;