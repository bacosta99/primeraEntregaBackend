import express from 'express'

const {Router} = express

import { productoDao, carritoDao } from './daos/index.js'

const app = express()
const routerProductos = Router()
const routerCarrito = Router()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const isAdmin = true

//productos

routerProductos.get('/:id?', async (req,res)=> {
    let id = req.params.id
    const productos = await productoDao.findById(id)
    res.send(productos)
})

routerProductos.post('/', async (req,res)=> {
    if(isAdmin) {
        let producto = req.body
        await productoDao.create(producto)
        res.send(producto)
    } else {
        res.send({error: "Disculpa amigo, no sos admin"})
    }
})

routerProductos.put('/:id', async (req,res)=> {
    if(isAdmin) {
        let producto = req.body
        let id = req.params.id
        const updated = await productoDao.update(id, producto)
        res.send(updated)
    } else {
        res.send({error: "Disculpa amigo, no sos admin"})
    }
})

routerProductos.delete('/:id', async (req,res)=> {
    if(isAdmin) {
        let id = parseInt(req.params.id)
        const deleted = await productoDao.delete(id)
        res.send(deleted)
    } else {
        res.send({error: "Disculpa amigo, no sos isAdmin"})
    }
})

// carrito

routerCarrito.post('/', async (req,res)=> {
    let carritoBlank = {timestamp: Date.now(), productos: []}
    const created = await carritoDao.create(carritoBlank)
    res.json({esto: created})
})

routerCarrito.delete('/:id', async (req,res)=> {
    let id = parseInt(req.params.id)
    const deleted = await carritoDao.delete(id)
    res.send(deleted)
})

routerCarrito.get('/:id/productos', async (req,res)=> {
    let id = req.params.id
    const carritos = await carritoDao.findById(id)
    res.send(carritos.productos)
})

routerCarrito.get('/:id?', async (req, res) => {
    let id = req.params.id
    const carritos = await carritoDao.findById(id)
    res.send({carritos})
})

routerCarrito.post('/:id/productos', async (req,res)=> {
    let productoId = req.body.id
    let carritoId = parseInt(req.params.id)
    const foundProduct = await productoDao.findById(productoId)
    if (!foundProduct.error) {
        const insertProduct = {id: foundProduct.id, timestamp: Date.now(), title: foundProduct.title, price: foundProduct.price, thumbnail: foundProduct.thumbnail, code: foundProduct.code, description: foundProduct.description, stock: foundProduct.stock} 
        const updatedCart = await carritoDao.updateCart(carritoId, insertProduct)
        res.send(updatedCart)
    } else {
        res.send(foundProduct.error)
    }
})

routerCarrito.delete('/:id/productos/:id_prod', async (req,res)=> {
    let productoId = parseInt(req.params.id_prod)
    let carritoId = parseInt(req.params.id)
    const foundProduct = await productoDao.checkId(productoId)
    const foundCart = await carritoDao.checkId(carritoId)
    if (!!foundCart.error || !!foundProduct.error) {
        const error = foundCart.error || foundProduct.error
        res.send(error)
    } else {
        const deletedFromCart = await carritoDao.deleteFromCart(carritoId, productoId)
        res.send(deletedFromCart)
    }
})


app.use('/api/productos',routerProductos)
app.use('/api/carrito',routerCarrito)

const PORT = 3060
const server = app.listen(PORT , ()=> {
    console.log(`Server running on port ${PORT}`)
})