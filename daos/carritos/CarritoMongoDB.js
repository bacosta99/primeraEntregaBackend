import { ContenedorMongoDb } from "../../contenedores/ContenedorMongoDb.js";
import { CarritosSchema } from "../../schemas/CarritosSchema.js";

export class CarritosMongoDB extends ContenedorMongoDb {
    constructor() {
        super('carritos', CarritosSchema)
    }

    async deleteFromCart(idCar, idProd) {
        const deletedProduct = await this.col.updateOne(
            {id: idCar},
            {$pull: 
                {productos: {id: idProd}}
            }
        )
        if (deletedProduct.modifiedCount == 0) {
            return {resp: "No se encontró el producto en el carrito"}
        } else {
            return {resp: "El producto fue eliminado del carrito"}
        }
    }

    async updateCart(idCar, product){
        if (!isNaN(idCar)) {
            const foundCart = await this.col.findOne({id: idCar})
            if (!foundCart) {
                res.send({error: "No hay un carrito con este ID en la base de datos"})
            } else {
                const updatedCart = await this.col.updateOne(
                    {id: idCar},
                    {$push: 
                        {productos: product}
                    }
                )
                return updatedCart
            }
    } else {
            return {error: "El id de carrito o el id de producto contienen un caracter invalido"}
        }
    }
}