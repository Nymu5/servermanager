const express = require("express");
const router = express.Router();
const { user_register, user_login, role_update, user_delete, user_change, user_username_change_self, user_password_change_self } = require("./auth");
const { auth_admin, auth_user } = require("./auth");

router.post("/user/login", user_login);
router.post("/user/register", auth_admin, user_register);
router.put("/user/delete", auth_admin, user_delete);
router.put("/user/change", auth_admin, user_change);
router.put("/role/update", auth_admin, role_update);

router.put('/user/update/username', auth_user, user_username_change_self);
router.put('/user/update/password', auth_user, user_password_change_self);


module.exports = router;