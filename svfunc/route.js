const express = require('express');
const router = express.Router();

const { auth_user } = require("../auth/auth");

const { get } = require("./services");
const { permissioner } = require("./permissioner");

router.get("/get", auth_user, permissioner, get);

module.exports = router