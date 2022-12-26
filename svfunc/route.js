const express = require('express');
const router = express.Router();

const { auth_user } = require("../auth/auth");

const { list } = require("./services");
const { permissioner } = require("./permissioner");

router.get("/services/list", auth_user, permissioner, list);

module.exports = router