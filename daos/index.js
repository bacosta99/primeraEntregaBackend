import { ProductosMongoDB } from "./productos/ProductosMongoDB.js"
import { CarritosMongoDB } from "./carritos/CarritoMongoDB.js"
import { ProductosFireBase } from "./productos/ProductosFireBase.js"
import { CarritoFireBase } from "./carritos/CarritoFireBase.js"

const db = 'firebase'  //PROCESS.ENV.TIPO_DB ||

let productoDao 
let carritoDao

switch(db){
    case 'mongodb': 
        productoDao = new ProductosMongoDB()
        carritoDao = new CarritosMongoDB()
        break
    
    case 'firebase': 
        productoDao = new ProductosFireBase()
        carritoDao = new CarritoFireBase()
        break
    
    default:
        productoDao = new ProductosMongoDB()
        carritoDao = new CarritosMongoDB()
        break

}

export { productoDao, carritoDao }