import _ from 'lodash';

class ProjectClientData {

    static normalize(data) {
        return {
            disabledViews: _.get(data, 'disabledViews', null),
            treatAsCatalog: _.get(data, 'treatAsCatalog', false)
        }
    }
}

module.exports = ProjectClientData;