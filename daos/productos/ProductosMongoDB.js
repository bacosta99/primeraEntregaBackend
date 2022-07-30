import { ContenedorMongoDb } from "../../contenedores/ContenedorMongoDb.js";
import { ProductosSchema } from "../../schemas/ProductosSchema.js";

export class ProductosMongoDB extends ContenedorMongoDb {
    constructor() {
        super('productos', ProductosSchema)
    }

    async update(unparsedId, element) {
        try {
            const id = parseInt(unparsedId)
            const foundProduct = this.checkId(id)
            if (!foundProduct.error) {
                element.id = id
                const updated = await this.col.replaceOne(
                    {id: id},
                    element
                    )
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