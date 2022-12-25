var express = require('express');
const {auth_admin} = require("../auth/auth");
var router = express.Router();
const User = require("../model/User");
const Role = require("../model/Role");

/* GET home page. */
router.get('/', auth_admin, async function(req, res, next) {
  const users = await User.find();
  const roles = await Role.find();
  let roles_mapped = {};
  roles.forEach(function(role) {
    roles_mapped[role._id] = role;
  })
  let users_censored = [];
  users.forEach(function(user) {
    users_censored.push({
      username: user.username,
      _id: user._id,
      role_id: user.role,
      role_name: roles_mapped[user.role].name.charAt(0).toUpperCase() + roles_mapped[user.role].name.slice(1)
    })
  })
  users_censored.sort((a,b) => {
    if ((a.role_name.toLowerCase() != "admin" && b.role_name.toLowerCase() != "admin") || (a.role_name.toLowerCase() == "admin" && b.role_name.toLowerCase() == "admin")) {
      if (a.username < b.username) return -1;
      if (a.username > b.username) return 1;
      return 0;
    }
    if (a.role_name.toLowerCase() == "admin" && b.role_name.toLowerCase() != "admin") return -1;
    if (a.role_name.toLowerCase() != "admin" && b.role_name.toLowerCase() == "admin") return 1;
  })
  let users_censored_obj = {};
  users_censored.forEach(function(user) {
    users_censored_obj[user._id] = user;
  })
  res.render('admin', { title: 'Admin | NSM', header: 'Admin', username: res.locals.username, permissions: res.locals.permissions, users: users_censored_obj, roles: roles_mapped });
});

module.exports = router;
