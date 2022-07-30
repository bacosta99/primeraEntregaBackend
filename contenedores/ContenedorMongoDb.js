import mongoose from "mongoose"
import { runMongo } from "../config.js"

runMongo()

export class ContenedorMongoDb {
    constructor(col, schema) {
        this.col = mongoose.model(col, schema)
    }

    async checkId(id) {     // Devuelve lo encontrado o el error corespondiente si el id no es valido
        try {
            if (!isNaN(id)) {
                const found = await this.getById(id)
                if (!found) {
                     return {error: "No hay un elemento con este ID en la base de datos"}
                } else {
                    return found
                }
            }
            else {
                return {error: "El ID indicado no es un caracter valido"}
            }
        } catch (error) {
            return error
        }
    }

    async getId() {         // consigue el id nuevo, siendo uno más al máximo actual, y si no encuentra ningun id, le asigna 1 al primero
        try {
            const idList = await this.col.distinct("id")
            if (idList.length == 0) {
                return 1
            } else {
                return Math.max(...idList) + 1
            }
        } catch (error) {
            return error
        }
    }

    async getById(id) {
        try {
            const result = await this.col.findOne({id: id})         // simple obtener por ID que se usa seguido
            return result
        } catch (error) {
            return error
        }
    }

    async getAll(){
        try {
            let collection = await this.col.find({})
            console.log(collection)
            return collection
        } catch (error) {
            return error
        }
    }

    async create(element) {
        try {
            const id = await this.getId()
            element.id = id
            this.col.create(element)
            console.log('Elemento creado')
        } catch (error) {
            return error
        }
    }
    
    async delete(unparsedId) {
        try {
            const id = parseInt(unparsedId)
            const found = await this.checkId(id)
            if (!found.error) {
                const deleted = await this.col.deleteOne({id: id})
                return deleted
            } else {
                return found.error
            } 
        } catch (error) {
            return error
        }
    }

    async findById(unparsedId) {
        try {
            let id = parseInt(unparsedId)
            const found = await this.checkId(id)
            if (!found.error) {
                return found
            } else {
                if (!unparsedId) {    // si es undefined, se muestran todos los productos
                    return this.getAll()
                } else {
                    return found.error
                }
            }
        } catch (error) {
            return error
        }
    }


}