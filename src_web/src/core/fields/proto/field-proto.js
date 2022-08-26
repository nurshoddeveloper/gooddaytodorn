
export default class FieldProto {

    constructor() {

    }

    get sortHintMessage() {
        console.error(this.constructor.name, 'sortHintMessage not implemented!');
    }

    listItemSortFunctions(sort /*asc/desc*/) {
        console.error(this.constructor.name, 'listItemSortFunctions not implemented!');
        return {
            functions: [() => 0],
            directions: [sort]
        }
    }


    get ListComponent() {
        console.error(this.constructor.name, 'ListComponent not implemented!');
    }

    get ViewComponent() {
        console.error(this.constructor.name, 'ViewComponent not implemented!');
    }

    get EditComponent() {
        console.error(this.constructor.name, 'EditComponent not implemented!');
    }

    getRenderComponent() {
        console.error(this.constructor.name, 'getRenderComponent not implemented!');
    }

}