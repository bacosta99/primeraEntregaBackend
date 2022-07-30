import mongoose from "mongoose"

const Schema = mongoose.Schema

export const CarritosSchema = new Schema({
    id: { type:Number, required: true },
    timestamp: { type:Number, required: true },
    productos: { type:Object, required: true },
})