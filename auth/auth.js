const User = require("../model/User");
const Role = require("../model/Role");
const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const assert = require("assert");
const jwtSecret = process.env.TOKEN;
const age = 3;

exports.user_register = async (req, res, next) => {
    const { username, password } = req.body;
    const basic = await Role.findOne({ name: "basic" })
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password too short!"
        })
    }
    try {
        bcrypt.hash(password, 10).then(async (hash) => {
            await User.create({
                username,
                password: hash,
                role: basic._id,
            }).then((user) => {
                const maxAge = age * 60 * 60;
                const token = jwt.sign({
                    id: user._id, username, role: user.role
                }, jwtSecret, { expiresIn: maxAge });
                //res.cookie("jwt", token, {
                //    maxAge: maxAge * 1000,
                //});
                res.status(200).json({
                    message: "User created successfully"
                })
            }).catch((err) => {
                return res.status(400).json({
                    message: `An error occurred: ${err.message}`,
                })
            })
        });
    } catch (err) {
        res.status(401).json({
            message: `User creation failed: ${err.message}`,
        })
    }
}

exports.user_login = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not specified",
        })
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({
                message: "Login failed: User not found"
            });
        } else {
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = age * 60 *60;
                    const token = jwt.sign(
                        { id: user._id, username, role: user.role }, jwtSecret,
                        { expiresIn: maxAge }
                    );
                    res.cookie("jwt", token, {
                        maxAge: maxAge * 1000,
                    })
                    return res.status(200).json({
                        message: "Login successful",
                    })
                }
                else return res.status(400).json({
                    message: "Login not successful - Check credentials"
                })
            });
        }
    } catch (err) {
        res.status(400).json({
            message: `An error occurred: ${err.message}`,
        })
    }
}

exports.role_update = async (req, res, next) => {
    const { role, id } = req.body;
    if (!role || !id) {
        return res.status(400).json({
            message: "Role or id missing: please provide missing details"
        })
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                message: "User not found: Check provided user id"
            })
        }
        let qRole;
        try {
            qRole = await Role.findById(role);
        } catch (err) {
            qRole = await Role.findOne({ name: role });
        }
        if (!qRole) {
            return res.status(400).json({
                message: "Role not found: Check given role"
            })
        }
        user.role = qRole._id;
        await User.findById(id)
            .then((user) => {
                user.role = qRole._id;
                user.save((err) => {
                    if (err) {
                        return res.status(400).json({
                            message: `An error occurred: ${err.message}`
                        })
                    }
                    return res.status(201).json({
                        message: "Role update successful"
                    })
                })
            }).catch((err) => {
                return res.status(400).json({
                    message: `An error occurred: ${err.message}`
                })
            })
    } catch (err) {
        return res.status(400).json({
            message: `An error occurred: ${err.message}`
        })
    }
}

exports.user_delete = async (req, res, next) => {
    const { id } = req.body;
    await User.findById(id)
        .then((user) => {
            user.remove();
            return res.status(201).json({
                message: "User deleted successfully",
            });
        }).catch((err) => {
            return res.status(400).json({
                message: `An error occurred ${err.message}`
            })
        });
}

exports.user_change = async (req, res, next) => {
    const { id, username } = req.body;
    if (!id || !username) {
        return res.status(400).json({
            message: "Id or username invalid: Check username and id"
        });
    }
    await User.findById(id)
        .then((user) => {
            user.username = username;
            user.save((err) => {
                if (err) {
                    return res.status(400).json({
                        message: `An error occurred: ${err.message}`
                    })
                }
                return res.status(201).json({
                    message: "Username updated successfully"
                })
            })
        }).catch((err) => {
            return res.status(400).json({
                message: `An error occurred: ${err.message}`
            })
        })
}

exports.user_username_change_self = async (req, res, next) => {
    const { username } = req.body;
    const token  = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({
            message: "Not authorized: Token not available"
        })
    }
    await jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                message: `An error occurred: ${err.message}`
            })
        }
        await User.findById(decodedToken.id)
            .then((user) => {
                user.username = username;
                user.save((err) => {
                    if (err) {
                        return res.status(400).json({
                            message: `An error occurred: ${err.message}`
                        })
                    }
                    return res.status(201).json({
                        message: "Username changed successfully",
                    })
                })
            }).catch((err) => {
                return res.status(400).json({
                    message: `An error occurred: ${err.message}`
                })
            })
    })
}

exports.user_password_change_self = async (req, res, next) => {
    const { old_password, new_password, new_password_confirm } = req.body;
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({
            message: "Not authorized: Token not available"
        })
    }
    if (new_password != new_password_confirm || new_password.length < 6) {
        return res.status(400).json({
            message: "Passwords mismatching or too short"
        })
    }
    await jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                message: `An error occurred: ${err.message}`
            })
        }
        await User.findById(decodedToken.id)
            .then(async (user) => {
                bcrypt.compare(old_password, user.password).then(async function (result) {
                    if (!result) {
                        return res.status(401).json({
                            message: "Current password invalid"
                        })
                    }
                    bcrypt.hash(new_password, 10).then(async (hash) => {
                        user.password = hash;
                        user.save((err) => {
                            if (err) {
                                return res.status(400).json({
                                    message: `An error occurred: ${err.message}`
                                })
                            }
                            return res.status(201).json({
                                message: "Password updated successfully"
                            })
                        })
                    })
                })
            }).catch((err) => {
                return res.status(400).json({
                    message: `An error occurred: ${err.message}`
                })
            })
    })
}

exports.role_permission_change = async (req, res, next) => {
    const { _id, permissions } = req.body;
    if (!_id || !permissions) {
        return res.status(400).json({
            message: "ID or permissions missing"
        })
    }
    await Role.findById(_id)
        .then((role) => {
            if (!role) {
                return res.status(400).json({
                    message: "Role not found",
                })
            }
            role.permissions = permissions;
            role.save((err) => {
                if (err) {
                    return res.status(400).json({
                        message: `An error occurred: ${err.message}`,
                    })
                }
                return res.status(200).json({
                    message: "Role permissions updated successfully"
                })
            })
        }).catch((err) => {
            return res.status(400).json({
                message: `An error occurred: ${err.message}`,
            })
        })
}

exports.role_delete = async (req, res, next) => {
    const { _id } = req.body;
    await Role.findById(_id)
        .then(async (role) => {
            if (!_id || !role) {
                return res.status(400).json({
                    message: "ID missing or role not found",
                })
            }
            if (role.name == "admin" || role.name == "basic") {
                return res.status(400).json({
                    message: "Cannot delete basic or admin role"
                })
            }
            const basic = await Role.findOne({ name: "basic" });
            if (!basic) {
                return res.status(500).json({
                    message: "Basic role not found"
                })
            }
            try {
                await User.updateMany({ role: role._id }, { role: basic._id });
            } catch (err) {
                return res.status(500).json({
                    message: `An error occurred: ${err.message}`
                })
            }
            role.delete((err) => {
                if (err) {
                    return res.status(400).json({
                        message: `An error occurred: ${err.message}`
                    })
                }
                return res.status(200).json({
                    message: "Role deleted successfully"
                })
            })
        }).catch((err) => {
            return res.status(400).json({
                message: `An error occurred: ${err.message}`,
            })
        })
}

exports.role_create = async (req, res, next) => {
    const { name, template_id } = req.body;
    if (!name) {
        return res.status(400).json({
            message: "Name or permissions not specified",
        })
    }
    let permissions = {};
    const template = await Role.findById(template_id);
    if (template != null) {
        permissions = template.permissions;
    } else {
        Object.keys((await Role.findOne()).permissions).forEach((permission) => {
            permissions[permission] = false;
        });
    }

    await Role.create({
        name,
        permissions
    }).then((role) => {
        return res.status(201).json({
            message: `Role ${role.name} created successfully`,
        })
    }).catch((err) => {
        return res.status(400).json({
            message: `An error occurred: ${err.message}`
        })
    })
}

exports.auth_admin = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({
            message: "Not authorized: Token not available"
        })
    }
    await jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                message: `An error occurred: ${err.message}`
            })
        }
        const user = await User.findById(decodedToken.id);
        const role = await Role.findById(user.role);
        if (!role || !user) {
            return res.status(401).json({
                message: "Not authorized: Check token"
            })
        }
        if (!role.permissions["admin"]) {
            return res.status(401).json({
                message: "Not authorized: not an admin"
            })
        }
        next();
    })
}

exports.auth_user = async (req, res, next) => {
    const token = req.cookies.jwt;
    const url = req.originalUrl;
    if (!token) {
        return res.status(401).json({
            message: "Not authorized: Token not available"
        })
    }
    await jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                message: "Not authorized: Check token"
            });
        }
        const user = await User.findById(decodedToken.id);
        const role = await Role.findById(user.role);
        if (err || !role || !user) {
            return res.status(401).json({
                message: "Not authorized: Check token"
            })
        }
        res.locals.user = user;
        res.locals.url = url;
        if (role.permissions.admin) {
            Object.keys(role.permissions).forEach((permission) => {
                role.permissions[permission] = true;
            })
        }
        res.locals.permissions = role.permissions;
        next();
    })
}

exports.auth_view = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.render('login', { title: 'Login | NSM' });
    }
    await jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        const user = await User.findById(decodedToken.id);
        const role = await Role.findById(user.role);
        if (err || !role || !user) {
            return res.render('login', { title: 'Login | NSM' });
        }
        if (role.permissions.admin) {
            Object.keys(role.permissions).forEach((permission) => {
                role.permissions[permission] = true;
            })
        }
        res.locals.permissions = role.permissions;
        res.locals.username = user.username;
        res.locals.user = {
            _id: user._id,
            username: user.username,
            role_id: role._id,
            role_name: role.name,
        };
        next();
    })
}