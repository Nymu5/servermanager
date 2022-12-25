const Mongoose = require("mongoose");
const RoleSchema = new Mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    permissions: {
        type: Mongoose.Schema.Types.Mixed
    }
})
const Role = Mongoose.model("role", RoleSchema);
module.exports = Role;