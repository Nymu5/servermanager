const express = require('express');
const router = express.Router();

const { auth_user } = require("../auth/auth");

const { list, details} = require("./services");
const { permissioner } = require("./permissioner");

router.get("/services/list", auth_user, permissioner, list);
router.get("/services/details", auth_user, permissioner, details);

module.exports = router