import mongoose from "mongoose"

const Schema = mongoose.Schema

export const ProductosSchema = new Schema({
    id: { type:Number, required: true },
    title: { type:String, required: true, max:24 },
    price: { type:Number, required: true },
    thumbnail: { type:String, required: true, max:100 },
    code: { type:String, required: true, max:6 },
    description: { type:String, required: true, max:100 },
    stock: { type:Number, required: true}, 
  })
  