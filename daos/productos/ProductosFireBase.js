import { ContenedorFireBase } from "../../contenedores/ContenedorFireBase.js";

export class ProductosFireBase extends ContenedorFireBase {
    constructor() {
        super('productos')
    }

    async update(unparsedId, element) {
        try {
            const id = parseInt(unparsedId)
            const foundProduct = this.checkId(id)
            if (!foundProduct.error) {
                element.id = id
                const updated = await this.query.doc(`${id}`).set(element)
                console.log(updated)
                return element
            }
            else {
                return error
            }
        } catch (error) {
            return error
        }

    }
}