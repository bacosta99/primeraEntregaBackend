import mongoose from "mongoose"

import admin from 'firebase-admin'
import serviceAccount from './firebaseDB/firebaseData.json' assert {type: 'json'}

export async function runMongo() {
    const URL = 'mongodb://127.0.0.1:27017/ecommerce'
    let rta = await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

export async function runFireBase() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}