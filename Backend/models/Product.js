const Mongoose = require("mongoose");

const  ProductSchema = new Mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,

    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    },
})

const User = Mongoose.model("user", UserSchema)
module.exports = User;