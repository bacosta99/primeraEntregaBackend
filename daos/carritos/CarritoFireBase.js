import { ContenedorFireBase } from "../../contenedores/ContenedorFireBase.js";
import { FieldValue } from "../../contenedores/ContenedorFireBase.js";

export class CarritoFireBase extends ContenedorFireBase {
    constructor(){
        super('carritos')
    }

    async deleteFromCart(idCar, idProd) {
        const cart = this.query.doc(`${idCar}`)
        const foundCart = await this.findById(idCar)
        const product = foundCart.productos.find(x => x.id == idProd)
        const deleted = await cart.update({productos: FieldValue.arrayRemove(product)})
        return deleted
    }

    async updateCart(idCar, product){
        if (!isNaN(idCar)) {
            const foundCart = await this.getById(idCar)
            if (!foundCart) {
                res.send({error: "No hay un carrito con este ID en la base de datos"})
            } else {
                const cart = this.query.doc(`${idCar}`)
                const updatedCart = await cart.update({productos: FieldValue.arrayUnion(product)})
                return updatedCart
            }
    } else {
            return {error: "El id de carrito o el id de producto contienen un caracter invalido"}
        }
    }
}