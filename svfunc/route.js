const express = require('express');
const router = express.Router();

const { auth_user } = require("../auth/auth");

const { list, details, stop, start, restart, journal} = require("./services");
const { permissioner } = require("./permissioner");
const { config } = require("./apache2")
const {view} = require("./filesystem");

router.get("/services/list", auth_user, permissioner, list);
router.get("/services/details", auth_user, permissioner, details);
router.put("/services/stop", auth_user, permissioner, stop);
router.put("/services/start", auth_user, permissioner, start);
router.put("/services/restart", auth_user, permissioner, restart);
router.get("/services/journal", auth_user, permissioner, journal);
router.get('/apache2/config', auth_user, permissioner, config);
router.get('/filesystem/view', auth_user, permissioner, view);

module.exports = router