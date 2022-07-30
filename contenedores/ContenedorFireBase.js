import admin from 'firebase-admin'
import { runFireBase } from '../config.js'
export const FieldValue = admin.firestore.FieldValue

runFireBase()

export class ContenedorFireBase {
    constructor(col) {
        this.db = admin.firestore()
        this.query = this.db.collection(col)
    }

    async checkId(id) {     //Devuelve lo encontrado o el error corespondiente si el id no es valido
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
    }

    async getById(id) {
        let result
        const results = await this.query.where('id', '==', id).get()        // simple obtener por ID que se usa seguido
        results.forEach(doc => {        // si hay un ID repetido por algun error, obtendré el último agregado
            result = doc.data()
        })
        return result
    }

    async getAllCol() {
        try {
            let collection = await this.query.get()
            return collection
        } catch (error) {
            console.log(error)
        }
    }


    async getAll() {
        try {
            let collection = await this.getAllCol()
            const documents = []
            collection.forEach(doc => {
                documents.push(doc.data())
            });
            return documents
        } catch (error) {
            console.log(error)
        }
    }

    async getId() {         //consigue el id nuevo, siendo uno más al máximo actual, y si no encuentra ningun id, le asigna 1 al primero
        try {
            const list = await this.getAll()
            const idList = []
            list.forEach(el => {
                idList.push(el.id)
            })
            if (idList.length == 0) {
                return 1
            } else {
                return Math.max(...idList) + 1
            }
        } catch (error) {
            return error
        }
    }

    async create(element) {
        try {
            const id = await this.getId()
            element.id = id
            const created = await this.query.doc(`${id}`).set(element)
            return created
        } catch (error) {
            return error
        }
    }

    async delete(unparsedId) {
        try {
            const id = parseInt(unparsedId)
            const found = await this.checkId(id)
            if (!found.error) {
                const deleted = await this.query.doc(`${id}`).delete()
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