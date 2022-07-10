import fs from 'fs'

export class Contenedor {
    constructor (route) {
        this.route = route
    }

    async getAll() {
        const result = await fs.promises.readFile(this.route)
        .then(function(all) {
            return JSON.parse(all)
        })
        .then(function(all) {
            if (typeof all === 'object' && Array.isArray(all)) {
                return all
            } else {
                const newAll = []
                newAll.push(all)
                return newAll
            }
        })
        .catch(function(error) {
            console.log("No hay productos cargados")
        })
        return result
    }

    loadArray(array) {
        this.getAll().then( (all)=> {
            all.forEach( (el)=> {
                array.push(el)
            })
        })
    }

    update(nuevoArray) { //funciona para un objeto, no para un array de objetos
        fs.promises.writeFile(this.route,JSON.stringify(nuevoArray))
    }
}

