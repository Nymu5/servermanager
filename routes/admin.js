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
  roles.sort((a,b) => {
    if ((a.permissions.admin && b.permissions.admin) || (!a.permissions.admin && !b.permissions.admin)) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }
    if (a.permissions.admin && !b.permissions.admin) return -1;
    if (!a.permissions.admin && b.permissions.admin) return 1;
  })
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
    if ((!roles_mapped[a.role_id].permissions.admin && !roles_mapped[b.role_id].permissions.admin) || (roles_mapped[a.role_id].permissions.admin && roles_mapped[b.role_id].permissions.admin)) {
      if (a.username < b.username) return -1;
      if (a.username > b.username) return 1;
      return 0;
    }
    if (roles_mapped[a.role_id].permissions.admin && !roles_mapped[b.role_id].permissions.admin) return -1;
    if (!roles_mapped[a.role_id].permissions.admin && roles_mapped[b.role_id].permissions.admin) return 1;
  })
  let users_censored_obj = {};
  users_censored.forEach(function(user) {
    users_censored_obj[user._id] = user;
  })
  let permissions = Object.keys(roles_mapped[Object.keys(roles_mapped)[0]].permissions)
  permissions.sort();
  let permission_categories = [];
  permissions.forEach((permission) => {
    let cat = permission.split("_")[0];
    if (permission_categories.indexOf(cat) == -1) permission_categories.push(cat);
  })
  res.render('admin', { title: 'Admin | NSM', header: 'Admin', username: res.locals.username, permissions: permissions, permission_categories: permission_categories, users: users_censored_obj, roles: roles_mapped, userpermissions: res.locals.permissions });
});

module.exports = router;
