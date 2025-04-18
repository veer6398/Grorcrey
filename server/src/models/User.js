import mongoose from "mongoose";

const usereSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cartItems: {type: Object, default: {}},
},{minimize: false})

const User = mongoose.model.user || mongoose.model('user', usereSchema)

export default User