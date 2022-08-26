import _ from 'lodash';
import SystemFieldProto from '../proto/system-field-proto';


export default class TagsField extends SystemFieldProto {

    constructor(entityType) {
        super(entityType);
    }

    get sortHintMessage() {
        return 'Sort by tags';
    }

    listItemSortFunctions(sort) {
        return {
            functions: [i => i.type == 'task' ? this.tagNames(i.item.tags) : 0],
            directions: [sort]
        }
    }

    tagNames(tags) {
        if (!tags) return '';

        const tagsModels = [];
        tags && tags.map(tId => {
            const tag = gd.session.projects.get(tId);
            if (tag && !tag.isArchived) tagsModels.push(tag);
        });

        if (tagsModels.length < 1) return '';

        if (tagsModels.length == 1) return tagsModels[0].name;

        const sortedModels = _.orderBy(tagsModels, m => m.name, 'asc');

        return _.map(sortedModels, 'name').join(' ');
    }
}