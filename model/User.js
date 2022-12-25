const Mongoose = require("mongoose");
const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
})

const User = Mongoose.model("user", UserSchema);
module.exports = User;