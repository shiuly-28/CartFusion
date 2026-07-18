import mongoose  from 'mongoose';
const mongoDBUrl = process.env.MONGODB_URL


if(!mongoDBUrl){
    throw new Error("DB error")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn:null, promise:null}
}