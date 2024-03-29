const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const localDB = `mongodb://127.0.0.1:27017/app_nymus_servermanager`
const Role = require("./model/Role")
const User = require("./model/User")

const fs = require('fs');
const jwt = require("jsonwebtoken");
const svfunc_folder = "./svfunc/";

let permission_names

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
    const admin_user = await User.findOne();
    if (!admin_user) {
        bcrypt.hash("nsm_master_password", 10).then(async (hash) => {
            const admin_role = await Role.findOne({ name: "admin" });
            await User.create({
                username: "admin",
                password: hash,
                role: admin_role._id,
            }).then((user) => {
                console.log("Admin user created! Change password ASAP!")
            }).catch((err) => {
                console.log("Error creating admin account!")
            })
        });
    }


    fs.readdir(svfunc_folder, async (err, files) => {
        let permission_categories = [];
        files.forEach((file) => {
            if (file != "route.js" && file != "permissioner.js") permission_categories.push(file.split(".")[0]);
        })
        let permissions = {};

        permission_categories.forEach((category) => {
            const cat = require(svfunc_folder + category);
            permissions[category] = Object.keys(cat);
        })

        permission_names = [];
        let categories = Object.keys(permissions)
        for (let cat_id = 0; cat_id < categories.length; cat_id++) {
            for (let func_id = 0; func_id < permissions[categories[cat_id]].length; func_id++) {
                permission_names.push(categories[cat_id] + "_" + permissions[categories[cat_id]][func_id]);
            }
        }

        let roles = await Role.find();
        roles.forEach((role) => {
            permission_names.forEach((permission) => {
                if (!(permission in role.permissions)) role.permissions[permission] = false;
            });
            if (true) {
                Object.keys(role.permissions).forEach((permission) => {
                    if (permission_names.indexOf(permission) == -1 && permission !== "admin") delete role.permissions[permission];
                })
            }
        })
        for (let i = 0; i < roles.length; i++) {
            await Role.findOneAndUpdate({_id: roles[i]._id}, {permissions: roles[i].permissions})
        }
    });
}
module.exports = connectDB();