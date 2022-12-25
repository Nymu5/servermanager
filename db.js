const Mongoose = require("mongoose");
const localDB = `mongodb://localhost:27017/app_nymus_servermanager`
const Role = require("./model/Role")
const connectDB = async () => {
    await Mongoose.connect(localDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("[INFO] MongoDB connected");

    const admin = await Role.findOne({ name: "admin" });
    const basic = await Role.findOne({ name: "basic" });
    if (!admin) {
        await Role.create({
            name: "admin",
            permissions: {
                "admin": true,
            }
        }).then(admin => {
            console.log(`[INFO] ${admin.name} created!`);
        }).catch((err) => {
            console.log(`[ERROR] ${err.message}`);
        });
    }
    if (!basic) {
        await Role.create({
            name: "basic",
            permissions: {
                "admin": false,
            }
        }).then(basic => {
            console.log(`[INFO] ${basic.name} created!`);
        }).catch((err) => {
            console.log(`[ERROR] ${err.message}`);
        })
    }
}
module.exports = connectDB();