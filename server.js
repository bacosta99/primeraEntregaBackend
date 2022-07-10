import express from 'express'
const {Router} = express

import {Contenedor} from './Contenedor.js'

const productosRoute = new Contenedor('./json/productos.json')
const carritosRoute = new Contenedor('./json/carritos.json')

const app = express()
const routerProductos = Router()
const routerCarrito = Router()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const admin = true

const productos = []
productosRoute.loadArray(productos)

const carritos = []
carritosRoute.loadArray(carritos)


class Carrito {
    constructor (id,timestamp,productos) {
        this.id = id
        this.timestamp = timestamp
        this.productos = productos
    }
}

class NuevoProducto {
    constructor (id, timestamp, title, price, thumbnail, code, description, stock) {
        this.id = id
        this.timestamp = timestamp
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.description = description
        this.stock = stock
    }
}

//productos

routerProductos.get('/:id?', (req,res)=> {
    let id = parseInt(req.params.id)
    if (!isNaN(id)) {
        const foundProduct = productos.find(x => x.id === id)
        if (!foundProduct) {
            res.send({error: "No hay un producto con este ID en la base de datos"})
        } else {
            res.json(foundProduct)
        }
    }
    else {
        if (!req.params.id) {    // si es undefined, se muestran todos los productos
            res.json(productos)
        } else {
            res.send({error: "El ID indicado no es un caracter valido"})
        }
    }
})

routerProductos.post('/', (req,res)=> {
    if(admin) {
        let producto = req.body
        const idList = []
        productos.forEach(element => {
            idList.push(parseInt(element.id))
        })
        const id = Math.max(...idList) + 1
        producto.id = id
        productos.push(producto)
        productosRoute.update(productos)
        res.json(productos)
    } else {
        res.send({error: "Disculpa amigo, no sos admin"})
    }
})

routerProductos.put('/:id', (req,res)=> {
    if(admin) {
        let producto = req.body
        let id = parseInt(req.params.id)
        if (!isNaN(id)) {
            const foundProduct = productos.find(x => x.id === id)
            if (typeof foundProduct === 'undefined') {
                res.send({error: "No hay un producto con este ID en la base de datos"})
            } else {
                let {title, price, thumbnail, code, description, stock} = producto
                const indexToUpdate = productos.indexOf(foundProduct)
                productos[indexToUpdate].title = title
                productos[indexToUpdate].price = price
                productos[indexToUpdate].thumbnail = thumbnail
                productos[indexToUpdate].code = code
                productos[indexToUpdate].description = description
                productos[indexToUpdate].stock = stock
                productosRoute.update(productos)
                res.json(productos)
            }
        }
    } else {
        res.send({error: "Disculpa amigo, no sos admin"})
    }
})

routerProductos.delete('/:id', (req,res)=> {
    if(admin) {
        let id = parseInt(req.params.id)
        if (!isNaN(id)) {
            const foundProduct = productos.find(x => x.id === id)
            if (!foundProduct) {
                res.send({error: "No hay un producto con este ID en la base de datos"})
            } else {
                const indexToDelete = productos.indexOf(foundProduct)
                productos.splice(indexToDelete,1)
                productosRoute.update(productos)
                res.json({res: `Se ha eliminado el objeto con id: ${id}`})
            }
        }
        else {
            res.send({error: "El ID indicado no es un caracter valido"})
        }
    } else {
        res.send({error: "Disculpa amigo, no sos admin"})
    }
})

// carrito

routerCarrito.post('/', (req,res)=> {
    const idList = []
    let id
    if(carritos.length === 0) {
        id = 1
    } else {
        carritos.forEach(element => {
            idList.push(parseInt(element.id))
        })
        id = Math.max(...idList) + 1
    }
    carritos.push(new Carrito(id,Date.now(),[]))
    carritosRoute.update(carritos)
    res.json(carritos)
})

routerCarrito.delete('/:id', (req,res)=> {
    let id = parseInt(req.params.id)
    if (!isNaN(id)) {
        const foundCart = carritos.find(x => x.id === id)
        if (!foundCart) {
            res.send({error: "No hay un carrito con este ID en la base de datos"})
        } else {
            const indexToDelete = carritos.indexOf(foundCart)
            carritos.splice(indexToDelete,1)
            carritosRoute.update(carritos)
            res.send({res: `Se ha eliminado el carrito con id: ${id}`, carrito: carritos})
        }
    }
    else {
        res.send({error: "El ID indicado no es un caracter valido"})
    }
})

routerCarrito.get('/:id/productos', (req,res)=> {
    let carritoId = parseInt(req.params.id)
    if (!isNaN(carritoId)) {
        const foundCart = carritos.find(x => x.id === carritoId)
        if (!foundCart) {
            res.send({error: "No hay un carrito con este ID en la base de datos"})
        } else {
            const cartIndex = carritos.indexOf(foundCart)
            res.json(carritos[cartIndex].productos)
        }
    } else {
        res.send({error: "El id de carrito es invalido"})
    }
})

routerCarrito.post('/:id/productos', (req,res)=> {
    let productoId = req.body.id
    let carritoId = parseInt(req.params.id)
    if (!isNaN(productoId) && !isNaN(carritoId)) {
        // obtengo el producto primero, buscando su id en el array productos
        const foundProduct = productos.find(x => x.id === productoId)
        if (!foundProduct) {
            res.send({error: "No hay un producto con este ID en la base de datos"})
        } else {
            // busco el carrito
            const foundCart = carritos.find(x => x.id === carritoId)
            if (!foundCart) {
                res.send({error: "No hay un carrito con este ID en la base de datos"})
            } else {
                const productToInsert = new NuevoProducto(foundProduct.id,Date.now(),foundProduct.title,foundProduct.price,foundProduct.thumbnail,foundProduct.code,foundProduct.description,foundProduct.stock)
                const cartIndex = carritos.indexOf(foundCart)
                carritos[cartIndex].productos.push(productToInsert)
                carritosRoute.update(carritos)
                res.json(carritos[cartIndex])
            }
        }
    } else {
        res.send({error: "El id de carrito o el id de producto contienen un caracter invalido"})
    }
})

routerCarrito.delete('/:id/productos/:id_prod', (req,res)=> {
    let carritoId = parseInt(req.params.id)
    let productoId = parseInt(req.params.id_prod)
    if (!isNaN(productoId) && !isNaN(carritoId)) {
        // busco el carrito
        const foundCart = carritos.find(x => x.id === carritoId)
        if (!foundCart) {
            res.send({error: "No hay un carrito con este ID en la base de datos"})
        } else {
            const cartIndex = carritos.indexOf(foundCart)
            const foundProduct = carritos[cartIndex].productos.find(x => x.id === productoId)
            if (!foundProduct) {
                res.send({error: "Este articulo no se encuentra en este carrito"})
            } else {
                const indexToDelete = carritos[cartIndex].productos.indexOf(foundProduct)
                carritos[cartIndex].productos.splice(indexToDelete,1)
                carritosRoute.update(carritos)
                res.json(carritos[cartIndex])
            }
        }
    } else {
        res.send({error: "El id de carrito o el id de producto contienen un caracter invalido"})
    }
})


app.use('/api/productos',routerProductos)
app.use('/api/carrito',routerCarrito)

const PORT = 3060
const server = app.listen(PORT , ()=> {
    console.log(`Server running on port ${PORT}`)
})